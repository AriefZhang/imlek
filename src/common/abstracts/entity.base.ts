import { Exclude } from 'class-transformer'
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntity {
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date
}
