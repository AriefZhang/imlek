import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => Voucher, (voucher) => voucher.transactions)
  @JoinTable({
    name: 'transaction_vouchers',
    joinColumn: {
      name: 'transaction_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'voucher_id',
      referencedColumnName: 'id',
    },
  })
  vouchers?: Voucher[];
}
