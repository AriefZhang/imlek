import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

import { ItemTransactionDto } from './item-transaction.dto';

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  totalAmount: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemTransactionDto)
  @ArrayMinSize(1)
  items: ItemTransactionDto[];
}
