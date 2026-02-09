import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../../common/abstracts';
import { Stand } from 'src/modules/stands/entities/stand.entity';

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
  description: string;

  @Exclude()
  @ManyToOne((_type) => Stand, (stand) => stand.id)
  @JoinColumn({ name: 'stand_id' })
  stand: Stand;
}
