import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../common/abstracts';
import { ItemTransaction } from '../../itemTransactions/entities/itemTransaction.entity';
import { TransactionVoucher } from '../../transactionVouchers/entities/transactionVoucher.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalAmount: number;

  @Column({ nullable: true, default: 0 })
  totalItemValue: number;

  @Column({ nullable: true, default: 0 })
  totalVoucherValue: number;

  @Column()
  paymentMethod: string;

  @Column()
  note: string;

  @OneToMany(
    (_type) => ItemTransaction,
    (itemTransaction) => itemTransaction.transaction,
  )
  itemTransactions: ItemTransaction[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => TransactionVoucher, (tv) => tv.transaction)
  transactionVouchers: TransactionVoucher[];
}
