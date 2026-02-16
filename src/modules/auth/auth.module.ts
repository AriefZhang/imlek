import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Service
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';

// Repository
import { UsersRepository } from '../users/users.repository';

// Strategy
import { jwtModuleOptions } from '../../config/jwt';
import { JwtAuthAdminGuard, JwtAuthGuard } from './guards';

const jwtModuleConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async () => jwtModuleOptions,
};

@Module({
  imports: [JwtModule.registerAsync(jwtModuleConfig)],
  providers: [
    AuthService,
    JwtAuthGuard,
    JwtAuthAdminGuard,
    UserService,
    UsersRepository,
  ],
  exports: [JwtAuthAdminGuard, JwtAuthGuard],
})
export class AuthModule {}
