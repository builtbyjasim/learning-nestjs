import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fName: string;

  @IsNotEmpty()
  @IsString()
  lName: string;

  @IsEmail()
  @IsString()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  profile?: string;
}
