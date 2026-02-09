import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class AddItemDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  price: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  standId: number;
}
