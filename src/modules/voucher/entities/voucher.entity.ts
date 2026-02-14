import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  value: number;

  @Exclude()
  @ManyToMany(() => Transaction, (tx) => tx.vouchers)
  transactions: Transaction[];
}
