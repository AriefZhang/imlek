import { IsString, IsOptional } from 'class-validator';

export class QuerySummaryStandItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  date: string;
}
