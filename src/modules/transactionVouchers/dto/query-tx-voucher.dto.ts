import { IsOptional, IsString } from 'class-validator';

export class QueryTxVoucherDto {
  @IsOptional()
  @IsString()
  standId?: string;

  @IsOptional()
  @IsString()
  date?: string;
}
