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
}
