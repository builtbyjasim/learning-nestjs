import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fName: string;

  @IsNotEmpty()
  lName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  role: string;

  @IsOptional()
  profile?: string;
}
