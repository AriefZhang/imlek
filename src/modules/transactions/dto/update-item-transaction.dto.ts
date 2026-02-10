import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ParseOptionalBoolean } from '../../../common/transformer/boolean.transformer';

export class UpdateItemTransactionDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  quantity: number;

  @ParseOptionalBoolean()
  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;
}
