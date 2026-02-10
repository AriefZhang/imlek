import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ServicesBase } from 'src/common/abstracts';
import { DataSource, EntityManager, In, QueryRunner } from 'typeorm';
import {
  CreateTransactionDto,
  ItemTransactionDto,
  UpdateTransactionDto,
} from './dto';
import { Transaction } from './entities/transaction.entity';
import { Item } from '../items/entities/item.entity';
import { handleError } from 'src/common/errors';
import { ItemTransaction } from '../itemTransactions/entities/itemTransaction.entity';
import { User } from '../users/entities/user.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/app.dtos';

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
    try {
      const tx = await this.getRepository().findOne({
        where: { id },
        relations: { itemTransactions: { item: true } },
      });

      if (!tx) {
        throw new NotFoundException('Transaction not found');
      }

      return tx;
    } catch (error) {
      handleError(error);
    }
  }

  async handleCreateItemTransaction(
    items: ItemTransactionDto[],
    selectedItems: Item[],
    tx: Transaction,
    manager: EntityManager,
  ) {
    const itemTxManager = manager.getRepository(ItemTransaction);

    const itemTransactions = selectedItems.map((item) => {
      const purchasedItem = items.find((i) => i.id === item.id);
      return itemTxManager.create({
        item,
        quantity: purchasedItem!.quantity,
        totalAmountPerItem: item.price * purchasedItem!.quantity,
        transaction: tx,
      });
    });

    return await itemTxManager.save(itemTransactions);
  }

  async handleUpdateItem(
    items: ItemTransactionDto[],
    tx: Transaction,
    manager: EntityManager,
  ) {
    const itemManager = manager.getRepository(Item);
    const selectedItems = await itemManager.find({
      where: { id: In(items.map((item) => item.id)) },
    });

    const itemTransactions = await this.handleCreateItemTransaction(
      items,
      selectedItems,
      tx,
      manager,
    );

    const updatedItem = selectedItems.map((item) => {
      const selectedItem = items.find((i) => i.id === item.id);
      const newQuantity = item.quantity - selectedItem!.quantity;
      if (newQuantity <= 0) {
        throw new BadRequestException(
          `Item ${item.name} is out of stock, current stock is ${item.quantity}`,
        );
      }
      return { ...item, quantity: newQuantity };
    });

    const finalItems = await itemManager.save(updatedItem);

    return finalItems;
  }

  async create(user: User, createTransactionDto: CreateTransactionDto) {
    const { queryRunner, manager } = this.getQueryManagerWithTransaction();
    try {
      const { items, totalAmount, paymentMethod, note } = createTransactionDto;
      const txManager = manager.getRepository(Transaction);

      const draftTx = txManager.create({
        totalAmount,
        paymentMethod,
        note,
      });
      draftTx.metadata = { cashier: { id: user.id, email: user.email } };
      const tx = await txManager.save(draftTx);

      await this.handleUpdateItem(items, tx, manager);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {}
}
