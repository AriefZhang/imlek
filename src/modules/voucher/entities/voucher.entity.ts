import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TransactionVoucher } from '../../transactionVouchers/entities/transactionVoucher.entity';

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
  @OneToMany(() => TransactionVoucher, (tv) => tv.voucher)
  transactionVouchers: TransactionVoucher[];
}
