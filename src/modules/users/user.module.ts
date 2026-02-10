import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

// Controller
import { UserController } from './user.controller';

// Service
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

// Repository
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  controllers: [UserController],
  providers: [AuthService, JwtService, UserService, UsersRepository],
})
export class UserModule {}
