import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../common/abstracts';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Stand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Exclude()
  @OneToMany((_type) => Item, (item) => item.stand)
  item: Item[];
}
