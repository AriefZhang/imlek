import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ItemTransactionDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
