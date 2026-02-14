import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { TransactionVoucher } from './entities/transactionVoucher.entity';

@Injectable()
export class TransactionVoucherService {
  private logger = new Logger('ItemTransactionService');
  private path = '/item-transaction';
  private entityName = 'item-transaction';
  constructor(private dataSource: DataSource) {}

  getRepository() {
    return this.dataSource.getRepository(TransactionVoucher);
  }

  async getTxVouxherSummary(): Promise<any[]> {
    return this.getRepository()
      .createQueryBuilder('tv')
      .innerJoin('tv.voucher', 'v')
      .select([
        'v.code AS code',
        'v.name AS name',
        'SUM(tv.quantity) AS totalVoucher',
      ])
      .groupBy('v.code')
      .addGroupBy('v.name')
      .orderBy('v.code', 'ASC')
      .getRawMany();
  }
}
