import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { apiResponse, ApiStatus } from 'src/utils/api-response';
import { LoginUserDto } from './dtos/login-user.dto';
import { logger } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModal: Model<UserDocument>,
  ) {}

  // register user
  async createUser(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const userData = createUserDto;

    try {
      const hashedPwd = await bcrypt.hash(password, 10);

      const user = await this.userModal.create({
        ...userData,
        password: hashedPwd,
      });

      return apiResponse({
        statusCode: ApiStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: {
          userId: user._id,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          role: user.role,
          profile: user.profile,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
      });
    } catch (error: any) {
      logger.log('Error during user creation:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('User registration failed');
    }
  }

  // login user
  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModal.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return apiResponse({
      statusCode: ApiStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: { userId: user._id.toString(), email: user.email, role: user.role },
    });
  }

  // get user profile
  async getUserProfile(userId: string) {
    const user = await this.userModal
      .findById(userId)
      .select('-password -__v -createdAt -updatedAt')
      .lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return apiResponse({
      statusCode: ApiStatus.OK,
      success: true,
      message: 'User profile retrieved successfully',
      data: { ...user },
    });
  }
}
