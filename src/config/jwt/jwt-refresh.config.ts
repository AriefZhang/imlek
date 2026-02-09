import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

import {
  JWT_REFRESH_EXPIRE_IN,
  JWT_REFRESH_SECRET,
} from '../../common/constants';

export const jwtRefreshSecretOptions: JwtSignOptions = {
  secret: JWT_REFRESH_SECRET,
};

export const jwtRefreshOptions: JwtSignOptions = {
  expiresIn: JWT_REFRESH_EXPIRE_IN,
};

export const jwtRefreshOptionsWithSecret: JwtSignOptions = {
  secret: JWT_REFRESH_SECRET,
  expiresIn: JWT_REFRESH_EXPIRE_IN,
};

export const jwtRefreshModuleOptions: JwtModuleOptions = {
  secret: JWT_REFRESH_SECRET,
  signOptions: jwtRefreshOptions,
};
