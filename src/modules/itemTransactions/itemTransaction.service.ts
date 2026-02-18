import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { QuerySummaryStandItemDto } from './dto';
import { Stand } from '../stands/entities/stand.entity';
import { ItemTransaction } from './entities/itemTransaction.entity';

@Injectable()
export class ItemTransactionService {
  private logger = new Logger('ItemTransactionService');
  private path = '/item-transaction';
  private entityName = 'item-transaction';
  constructor(private dataSource: DataSource) {}

  getRepository() {
    return this.dataSource.getRepository(ItemTransaction);
  }

  getStandRepository() {
    return this.dataSource.getRepository(Stand);
  }

  async getItemById(id: number): Promise<ItemTransaction> {
    const itemTx = await this.getRepository().findOne({ where: { id } });
    if (!itemTx) {
      throw new NotFoundException('Item Transaction not found');
    }
    return itemTx;
  }

  async getStandSummary(
    id: number,
    dto: QuerySummaryStandItemDto,
  ): Promise<any[]> {
    const keyword = dto.name?.trim() ?? '';
    const date = dto.date?.trim() ?? '';
    console.log({ date });

    const qb = this.getRepository()
      .createQueryBuilder('it') // ItemTransaction
      .innerJoin('it.item', 'item')
      .innerJoin('item.stand', 'stand')
      .select([
        'item.code AS code',
        'item.name AS name',
        'SUM(it.totalAmountPerItem) AS totalAmount',
        'SUM(it.quantity) AS totalQty',
        'COUNT(DISTINCT it.id) AS totalTx',
      ])
      .where('stand.id = :id', { id })
      .andWhere('(item.code ILIKE :keyword OR item.name ILIKE :keyword)', {
        keyword: `%${keyword}%`,
      });

    if (date) {
      qb.andWhere('DATE(it.createdAt) = :date', {
        date,
      });
    }

    return qb
      .groupBy('item.code')
      .addGroupBy('item.name')
      .orderBy('item.code', 'ASC')
      .getRawMany();
  }
}
