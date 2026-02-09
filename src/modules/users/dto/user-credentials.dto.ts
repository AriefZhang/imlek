import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UserCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string
}
