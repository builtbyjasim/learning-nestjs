import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { SaveRefreshTokenDto } from './dtos/save-access-token.dto';
import { RefreshTokensDto } from './dtos/refresh-tokens.dto';
import { JwtService } from '@nestjs/jwt';
import { apiResponse, logger } from 'src/utils';
import { JwtPayload } from 'src/common/entities/jwt-payload.type';
import { ApiStatus } from 'src/utils/api-response';

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

    await this.tokenModal.findOneAndUpdate(
      { userId }, // Find by userId
      {
        refreshToken,
        expiresAt,
      },
      {
        upsert: true, // Create if doesn't exist, update if exists
        new: true, // Return the updated document
      },
    );
  }

  // refresh token validation
  async refreshTokens(refreshTokensDto: RefreshTokensDto) {
    const { refreshToken } = refreshTokensDto;

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException({
        // error: error as string,
        message: 'Invalid refresh token',
      });
    }

    logger.log('Decoded payload from refresh token:', payload);
    const { sub, email, role } = payload;

    // 2. Check refresh token exists in DB
    const tokenDoc = await this.tokenModal.findOne({ userId: sub });

    if (!tokenDoc) {
      throw new UnauthorizedException('Refresh token not found. Please login.');
    }

    if (tokenDoc.refreshToken !== refreshToken) {
      throw new UnauthorizedException(
        'Refresh token mismatch. Please login again.',
      );
    }

    if (tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Refresh token expired. Please login again.',
      );
    }

    const newPayload: JwtPayload = { sub, email, role };

    let newAccessToken: string;
    let newRefreshToken: string;
    try {
      newAccessToken = await this.jwtService.signAsync(newPayload);
      newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
      });
    } catch {
      throw new InternalServerErrorException({
        // error: error as string,
        message: 'Authentication service unavailable',
      });
    }

    await this.tokenModal.findOneAndUpdate(
      { userId: sub },
      {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { new: true },
    );

    return apiResponse({
      statusCode: ApiStatus.CREATED,
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userId: sub,
        email: email,
        role: role,
      },
    });
  }
}
