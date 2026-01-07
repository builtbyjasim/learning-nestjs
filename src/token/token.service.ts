import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { SaveRefreshTokenDto } from './dtos/save-access-token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private readonly tokenModal: Model<TokenDocument>,
  ) {}

  // save refresh token
  async saveRefreshToken(saveRefreshTokenDto: SaveRefreshTokenDto) {
    const { userId, refreshToken, expiresAt } = saveRefreshTokenDto;
    await this.tokenModal.create({
      userId,
      refreshToken,
      expiresAt,
    });
  }
}
