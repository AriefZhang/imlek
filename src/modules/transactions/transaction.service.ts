import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, In, QueryRunner } from 'typeorm';
import {
  CreateTransactionDto,
  ItemTransactionDto,
  QueryIncomeDto,
  UpdateTransactionDto,
} from './dto';
import { Transaction } from './entities/transaction.entity';
import { Item } from '../items/entities/item.entity';
import { handleError } from 'src/common/errors';
import { ItemTransaction } from '../itemTransactions/entities/itemTransaction.entity';
import { User } from '../users/entities/user.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/app.dtos';
import { UpdateItemTransactionDto } from './dto/update-item-transaction.dto';
import { Voucher } from '../voucher/entities/voucher.entity';
import { TransactionVoucher } from '../transactionVouchers/entities/transactionVoucher.entity';

@Injectable()
export class TransactionService {
  constructor(private dataSource: DataSource) {}

  getQueryRunner(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }

  getQueryManager(): EntityManager {
    return this.dataSource.manager;
  }

  getQueryManagerWithTransaction(): {
    queryRunner: QueryRunner;
    manager: EntityManager;
  } {
    const queryRunner = this.getQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    const manager = queryRunner.manager;

    return { queryRunner, manager };
  }

  getRepository() {
    return this.dataSource.getRepository(Transaction);
  }

  getItemRepository() {
    return this.dataSource.getRepository(Item);
  }

  async findAllTransaction(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Transaction>> {
    const [entities, itemCount] = await this.getRepository().findAndCount({
      relations: { itemTransactions: { item: true } },
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findTransaction(id: number) {
    const tx = await this.getRepository().findOne({
      where: { id },
      relations: {
        itemTransactions: { item: true },
        transactionVouchers: { voucher: true },
      },
    });

    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }

    return tx;
  }

  async handleUpdateItem(
    items: ItemTransactionDto[],
    tx: Transaction,
    manager: EntityManager,
  ) {
    const itemManager = manager.getRepository(Item);
    const selectedItems = await itemManager
      .createQueryBuilder('item')
      .setLock('pessimistic_write')
      .where('item.id IN (:...ids)', {
        ids: items.map((i) => i.id),
      })
      .getMany();

    if (selectedItems.length !== items.length) {
      throw new BadRequestException('Some items not found');
    }

    const itemTxManager = manager.getRepository(ItemTransaction);
    let totalAmount = 0;

    const itemsTransaction = selectedItems.map((item) => {
      const selectedItem = items.find((i) => i.id === item.id)!;

      if (item.quantity < selectedItem.quantity) {
        throw new BadRequestException(`Item ${item.name} is out of stock`);
      }

      item.quantity -= selectedItem.quantity;
      totalAmount += item.price * selectedItem.quantity;

      return itemTxManager.create({
        item,
        quantity: selectedItem.quantity,
        totalAmountPerItem: item.price * selectedItem.quantity,
        transaction: tx,
      });
    });

    await itemManager.save(selectedItems);
    await itemTxManager.save(itemsTransaction);
    return { totalAmount, itemsTransaction };
  }

  async getAllIncome(queryIncomeDto: QueryIncomeDto) {
    const qb = this.getRepository()
      .createQueryBuilder('t')
      .select('t.paymentMethod', 'paymentMethod')
      .addSelect('SUM(t.totalAmount)', 'totalCash')
      .addSelect('SUM(t.totalItemValue)', 'totalIncome')
      .addSelect('SUM(t.totalVoucherValue)', 'totalVoucher')
      .addSelect('COUNT(t.id)', 'totalTx');

    if (queryIncomeDto.stand) {
      qb.addSelect(
        `
        SUM(
          COALESCE(
            (
              SELECT SUM(it.total_amount_per_item)
              FROM item_transaction it
              INNER JOIN item i ON i.id = it.item_id
              WHERE it.transaction_id = t.id
                AND i.stand_id = :standId
            ),
            0
          )
        )
        `,
        'totalCashPerStand',
      );
      qb.andWhere(
        `
      EXISTS (
        SELECT 1
        FROM item_transaction it
        INNER JOIN item i ON i.id = it.item_id
        WHERE it.transaction_id = t.id
          AND i.stand_id = :standId
      )
    `,
        {
          standId: queryIncomeDto.stand,
        },
      );
    }

    qb.groupBy('t.paymentMethod');

    return qb.getRawMany();
  }

  async getVoucher(id: number, manager: EntityManager) {
    const voucherManager = manager.getRepository(Voucher);

    const voucher = await voucherManager.findOne({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }
    return voucher;
  }

  async create(user: User, createTransactionDto: CreateTransactionDto) {
    const { queryRunner, manager } = this.getQueryManagerWithTransaction();
    try {
      const { items, vouchers, paymentMethod, note } = createTransactionDto;
      const txManager = manager.getRepository(Transaction);

      const draftTx = txManager.create({
        totalAmount: 0,
        paymentMethod,
        note,
      });
      draftTx.metadata = { cashier: { id: user.id, email: user.email } };
      const tx = await txManager.save(draftTx);

      let vouchersToSave: TransactionVoucher[] = [];
      if (vouchers) {
        const voucherManager = manager.getRepository(Voucher);
        const txVoucherManager = manager.getRepository(TransactionVoucher);
        const voucherIds = vouchers.map((v) => v.id);
        const foundVouchers = await voucherManager
          .createQueryBuilder('voucher')
          .setLock('pessimistic_write')
          .where('voucher.id IN (:...ids)', { ids: voucherIds })
          .getMany();

        if (foundVouchers.length !== vouchers.length) {
          throw new BadRequestException('Some vouchers not found');
        }

        const txVoucher = foundVouchers.map((v) =>
          txVoucherManager.create({
            transaction: tx,
            voucher: v,
            quantity: vouchers.find((vcr) => vcr.id === v.id)!.quantity,
          }),
        );

        await txVoucherManager.save(txVoucher);
        await voucherManager.save(foundVouchers);

        vouchersToSave = txVoucher;
      }

      const totalVoucherValue = vouchersToSave.reduce(
        (a, b) => a + b.voucher.value * b.quantity,
        0,
      );

      const { totalAmount, itemsTransaction } = await this.handleUpdateItem(
        items,
        tx,
        manager,
      );

      await txManager.update(tx.id, {
        totalAmount: Math.max(totalAmount - totalVoucherValue, 0),
        totalItemValue: totalAmount,
        totalVoucherValue,
        metadata: {
          ...tx.metadata,
          items: itemsTransaction.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            totalAmountPerItem: i.totalAmountPerItem,
            item: {
              id: i.item.id,
              name: i.item.name,
              code: i.item.code,
              price: i.item.price,
            },
          })),
        },
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async handleUpdateTxItem(
    items: UpdateItemTransactionDto[],
    txItems: ItemTransaction[],
    manager: EntityManager,
  ) {
    const itemManager = manager.getRepository(Item);
    const ItemTxManager = manager.getRepository(ItemTransaction);

    const newTxItems = txItems.map((txItem) => {
      const selectedItem = items.find((i) => i.id === txItem.id);
      if (!selectedItem) {
        return txItem;
      }
      const qtyGap = selectedItem.quantity - txItem.quantity;

      const newItem = txItem.item;
      const newQuantity = newItem.quantity - qtyGap;
      if (newQuantity <= 0) {
        throw new BadRequestException(
          `Item ${newItem.name} is out of stock, current stock is ${newItem.quantity}`,
        );
      }
      itemManager.update(newItem.id, {
        quantity: newQuantity,
      });

      const newData = {
        ...txItem,
        quantity: selectedItem.quantity,
        totalAmountPerItem: txItem.item.price * selectedItem.quantity,
      };
      return newData;
    });
    const newTotalAmount = newTxItems.reduce(
      (acc, txItem) => acc + txItem.totalAmountPerItem,
      0,
    );

    await ItemTxManager.save(newTxItems);
    return newTotalAmount;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const { queryRunner, manager } = this.getQueryManagerWithTransaction();
    try {
      const { updateItems, paymentMethod, note } = updateTransactionDto;
      const txManager = manager.getRepository(Transaction);

      const foundTx = await this.findTransaction(id);
      if (paymentMethod) foundTx.paymentMethod = paymentMethod;
      if (note) foundTx.note = note;

      const totalAmount = await this.handleUpdateTxItem(
        updateItems!,
        foundTx.itemTransactions,
        manager,
      );
      foundTx.totalAmount = totalAmount;

      await txManager.save(foundTx);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }
}
