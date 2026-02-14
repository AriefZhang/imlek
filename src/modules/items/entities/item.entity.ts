import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../../common/abstracts';
import { Stand } from '../../stands/entities/stand.entity';
import { ItemTransaction } from '../../itemTransactions/entities/itemTransaction.entity';

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Exclude()
  @ManyToOne((_type) => Stand, (stand) => stand.id)
  @JoinColumn({ name: 'stand_id' })
  stand: Stand;

  @Exclude()
  @OneToMany((_type) => ItemTransaction, (transaction) => transaction.item)
  transaction: ItemTransaction[];
}
