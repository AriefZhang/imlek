import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

import { ItemTransactionDto, VoucherTransactionDto } from './';

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemTransactionDto)
  @ArrayMinSize(1)
  items: ItemTransactionDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VoucherTransactionDto)
  @ArrayMinSize(0)
  vouchers: VoucherTransactionDto[];
}
