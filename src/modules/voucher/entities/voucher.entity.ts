import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
