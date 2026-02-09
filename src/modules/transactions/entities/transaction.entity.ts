import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../../common/abstracts';
import { ItemTransaction } from 'src/modules/itemTransactions/entities/itemTransaction.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalAmount: number;

  @OneToMany(
    (_type) => ItemTransaction,
    (itemTransaction) => itemTransaction.id,
  )
  @JoinColumn({ name: 'item_transaction_id' })
  itemTransaction: ItemTransaction[];
}
