import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt'

import { JWT_EXPIRE_IN, JWT_SECRET } from '../../common/constants'

export const jwtOptions: JwtSignOptions = {
  expiresIn: JWT_EXPIRE_IN,
}

export const jwtSecretOptions: JwtSignOptions = {
  secret: JWT_SECRET,
}

export const jwtOptionsWithSecret: JwtSignOptions = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRE_IN,
}

export const jwtModuleOptions: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: jwtOptions,
}
