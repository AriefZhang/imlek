import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class VoucherTransactionDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
