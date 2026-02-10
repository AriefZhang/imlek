import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { SignInResponse, JwtPayloadWithExp } from '../../common/types';
import { GetJwtPayload } from '../../common/decorators';
import { JwtAuthAdminGuard, JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

import { SignInCredentialsDto, UserCredentialsDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signin')
  async signIn(
    @Body() signInCredentialsDto: SignInCredentialsDto,
  ): Promise<SignInResponse> {
    return await this.userService.signIn(signInCredentialsDto);
  }

  @Post('/create')
  @UseGuards(JwtAuthAdminGuard)
  async create(@Body() authCredentialsDto: UserCredentialsDto): Promise<User> {
    return await this.userService.create(authCredentialsDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getUserData(
    @GetJwtPayload() jwtPayload: JwtPayloadWithExp,
  ): Promise<User> {
    return await this.userService.getUserData(jwtPayload);
  }
}
