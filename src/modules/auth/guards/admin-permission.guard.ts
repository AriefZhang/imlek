import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { BaseStrategyGuard } from './base-strategy.guard';

@Injectable()
export class JwtAuthAdminGuard
  extends BaseStrategyGuard
  implements CanActivate
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const manager = this.dataSource.manager;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const { role } = payload;
      await this.validateRole(role);

      const user = await this.getUser(payload.userId, manager);

      request.jwt = payload;
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }
}
