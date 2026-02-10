import { UnauthorizedException } from '@nestjs/common';
import type { StringValue } from 'ms';

// SECRET
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN as
  | StringValue
  | undefined;

if (!JWT_EXPIRE_IN) {
  throw new UnauthorizedException('JWT_REFRESH_EXPIRE_IN is not set');
}

export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export const JWT_REFRESH_EXPIRE_IN = process.env.JWT_REFRESH_EXPIRE_IN as
  | StringValue
  | undefined;

// STRATEGY
export const JWT_STRATEGY = 'jwt';
export const JWT_REFRESH_STRATEGY = 'jwt-refresh';
export const ADMIN_PERMISSION_STRATEGY = 'admin-permission';
