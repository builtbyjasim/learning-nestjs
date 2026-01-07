import { IsNotEmpty } from 'class-validator';

export class SaveRefreshTokenDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  refreshToken: string;

  @IsNotEmpty()
  expiresAt: Date;
}
