import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { TransactionVoucher } from './entities/transactionVoucher.entity';
import { QueryTxVoucherDto } from './dto/query-tx-voucher.dto';

@Injectable()
export class TransactionVoucherService {
  private logger = new Logger('ItemTransactionService');
  private path = '/item-transaction';
  private entityName = 'item-transaction';
  constructor(private dataSource: DataSource) {}

  getRepository() {
    return this.dataSource.getRepository(TransactionVoucher);
  }

  async getTxVoucherSummary(dto: QueryTxVoucherDto): Promise<any[]> {
    const { standId, date } = dto;
    const qb = this.getRepository()
      .createQueryBuilder('tv')
      .innerJoin('tv.voucher', 'v')
      .innerJoin('tv.transaction', 't')
      .select([
        'v.code AS code',
        'v.name AS name',
        'v.value AS value',
        'SUM(tv.quantity) AS totalVoucher',
      ])
      .groupBy('v.code')
      .addGroupBy('v.name')
      .addGroupBy('v.value')
      .orderBy('v.code', 'ASC');

    if (standId) {
      qb.andWhere((qb2) => {
        const sub = qb2
          .subQuery()
          .select('1')
          .from('item_transaction', 'it')
          .innerJoin('item', 'i', 'i.id = it.item_id')
          .where('it.transaction_id = t.id')
          .andWhere('i.stand_id = :standId')
          .getQuery();

        return `EXISTS ${sub}`;
      }).setParameter('standId', Number(standId));
    }

    if (date) {
      qb.andWhere('DATE(tv.createdAt) = :date', { date });
    }

    return qb.getRawMany();
  }
}
