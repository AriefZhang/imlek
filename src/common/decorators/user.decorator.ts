import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../../modules/users/entities/user.entity';
import { JwtPayloadWithExp } from '../../common/types';

export const GetJwtPayload = createParamDecorator(
  (_data, ctx: ExecutionContext): JwtPayloadWithExp => {
    const req = ctx.switchToHttp().getRequest();
    return req.jwt;
  },
);

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
