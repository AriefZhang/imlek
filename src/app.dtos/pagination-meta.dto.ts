import { ApiProperty } from '@nestjs/swagger'
import { PageMetaDtoParameters } from '../common/types'

export class PageMetaDto {
  @ApiProperty()
  readonly page: number

  @ApiProperty()
  readonly take: number

  @ApiProperty()
  readonly itemCount: number

  @ApiProperty()
  readonly pageCount: number

  @ApiProperty()
  readonly hasPreviousPage: boolean

  @ApiProperty()
  readonly hasNextPage: boolean

  @ApiProperty()
  readonly others?: any

  constructor({ pageOptionsDto, itemCount, others }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page ?? 1
    this.take = pageOptionsDto.take ?? 20
    this.itemCount = itemCount
    this.pageCount = Math.ceil(this.itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
    this.others = others ? others : undefined
  }
}
