import { IsString, IsOptional } from 'class-validator';

export class QueryStandItemDto {
  @IsOptional()
  @IsString()
  name: string;
}
