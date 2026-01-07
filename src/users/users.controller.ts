import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/entities/request-with-user.type';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/guards/roles/roles.decorator';
import { Role } from '../common/enum/role.enum';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('profile')
  async getUserProfile(@Req() req: RequestWithUser) {
    const { userId } = req.user;
    return await this.usersService.getUserProfile(userId);
  }
}
