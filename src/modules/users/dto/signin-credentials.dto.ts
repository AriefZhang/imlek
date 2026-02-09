import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator'

export class SignInCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string
}
