import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/app.dtos';

export class AllItemsDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  date?: string;
}
