import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { EntityManager } from 'typeorm';

import { User } from '../../../modules/users/entities/user.entity';
import { UserRoles } from '../../../common/types';
import { isSuperAdmin } from '../../../common/helpers';

@Injectable()
export class BaseStrategyGuard {
  constructor() {}

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async getUser(userId: string, manager: EntityManager) {
    const userManager = manager.getRepository(User);

    const user = await userManager.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }

  validatePermissions(
    requiredPermissions: string[],
    userPermissions: number[],
  ) {
    for (const permission of requiredPermissions) {
      if (!userPermissions.includes(parseInt(permission))) {
        throw new UnauthorizedException(
          'You are not allowed to perform this action.',
        );
      }
    }
  }

  async validateRole(role: UserRoles): Promise<void> {
    const allowAccess = isSuperAdmin(role);

    if (!allowAccess) {
      throw new UnauthorizedException();
    }
  }
}
