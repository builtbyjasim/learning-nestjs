import { IsNotEmpty, IsString } from 'class-validator';

export class SaveRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @IsString()
  expiresAt: Date;
}
