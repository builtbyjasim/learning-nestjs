import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/entities/request-with-user.type';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Req() req: RequestWithUser) {
    const { userId } = req.user;
    return await this.usersService.getUserProfile(userId);
  }
}
