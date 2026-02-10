import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

import { JwtPayloadWithExp } from '../../../common/types';
import { BaseStrategyGuard } from './base-strategy.guard';

@Injectable()
export class JwtAuthGuard extends BaseStrategyGuard implements CanActivate {
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
      const payload: JwtPayloadWithExp = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      );

      const user = await this.getUser(payload.userId, manager);

      request.jwt = payload;
      request.token = token;
      request.user = user;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
    return true;
  }
}
