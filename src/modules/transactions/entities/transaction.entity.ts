import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../../common/abstracts';
import { ItemTransaction } from '../../itemTransactions/entities/itemTransaction.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalAmount: number;

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

  @ManyToOne(() => Voucher, { nullable: true })
  @JoinColumn({ name: 'voucher_id' })
  voucher?: Voucher;

  @Column({ nullable: true })
  voucherCode?: string;

  @Column({ nullable: true })
  voucherType?: string;

  @Column({ nullable: true })
  voucherValue?: number;
}
