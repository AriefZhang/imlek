import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';

import { CreateTransactionDto } from './create-transaction.dto';
import { UpdateItemTransactionDto } from './update-item-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemTransactionDto)
  @ArrayMinSize(1)
  updateItems: UpdateItemTransactionDto[];
}
