import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Transaction } from '../../transactions/entities/transaction.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { BaseEntity } from 'src/common/abstracts';

@Entity('transaction_vouchers')
export class TransactionVoucher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (tx) => tx.transactionVouchers, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Voucher, (v) => v.transactionVouchers, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @Column()
  quantity: number;
}
