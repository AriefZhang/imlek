import { IsOptional, IsString } from 'class-validator';

export class QueryIncomeDto {
  @IsOptional()
  @IsString()
  stand?: string;
}
