import { Column } from 'typeorm'

import { BaseEntity } from './entity.base'

export abstract class BaseEntityWithAddress extends BaseEntity {
  @Column({ nullable: true })
  addressLine1: string

  @Column({ nullable: true })
  addressLine2: string

  @Column({ nullable: true })
  zipCode: string
}
