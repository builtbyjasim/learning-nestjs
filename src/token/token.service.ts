import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { SaveRefreshTokenDto } from './dtos/save-access-token.dto';
import { RefreshTokensDto } from './dtos/refresh-tokens.dto';
import { JwtService } from '@nestjs/jwt';
import { logger } from 'src/utils';
import { JwtPayload } from 'src/common/entities/jwt-payload.type';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private readonly tokenModal: Model<TokenDocument>,
    private readonly jwtService: JwtService,
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

  // refresh token validation
  async refreshTokens(refreshTokensDto: RefreshTokensDto) {
    const { refreshToken } = refreshTokensDto;
    logger.log('Received refresh token:', refreshToken);
    // const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    let payload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    } catch (error) {
      logger.log('verifyAsync error: ', JSON.stringify(error));
      // throw new UnauthorizedException(
      //   error?.message || 'Invalid refresh token',
      // );
    }

    logger.log('Payload from refresh token:', payload);
  }
}
