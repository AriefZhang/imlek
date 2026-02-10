import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../../common/abstracts';
import { Item } from 'src/modules/items/entities/item.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';

@Entity()
export class ItemTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  totalAmountPerItem: number;

  @ManyToOne((_type) => Item, (item) => item.id)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Exclude()
  @ManyToOne(
    (_type) => Transaction,
    (transaction) => transaction.itemTransactions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
