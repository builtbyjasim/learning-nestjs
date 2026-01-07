import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/entities/jwt-payload.type';
import { RefreshTokensDto } from 'src/token/dtos/refresh-tokens.dto';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  // register user
  async createUser(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  // login user
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.loginUser(loginUserDto);

    const payload: JwtPayload = {
      sub: user.data?.userId,
      email: user.data?.email,
      role: user.data?.role,
    };

    let accessToken: string;
    let refreshToken: string;

    try {
      accessToken = await this.jwtService.signAsync(payload);
      refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
    } catch (error) {
      throw new InternalServerErrorException({
        error: error as string,
        message: 'Authentication service unavailable',
      });
    }

    if (user.data?.userId && typeof user.data?.userId === 'string') {
      await this.tokenService.saveRefreshToken({
        userId: user.data?.userId,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
      });
    }

    const result = {
      ...user,
      data: {
        ...user.data,
        accessToken,
        refreshToken,
      },
    };
    return result;
  }

  // refresh token validation
  async refreshTokens(refreshTokensDto: RefreshTokensDto) {
    return await this.tokenService.refreshTokens(refreshTokensDto);
  }
}
