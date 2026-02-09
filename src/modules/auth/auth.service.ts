import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

import { JwtPayload, JwtPayloadWithExp } from '../../common/types';
import { SignInCredentialsDto } from '../users/dto';
import { decryptPassword } from 'src/common/helpers';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  generateToken(payload: JwtPayload, options: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  verifyToken(
    token: string,
    options: JwtVerifyOptions,
  ): JwtPayloadWithExp | string {
    try {
      return this.jwtService.verify(token, options) as JwtPayloadWithExp;
    } catch (error) {
      return error.name;
    }
  }

  async validateUser(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<User> {
    const manager = this.dataSource.manager;
    const userManager = manager.getRepository(User);

    const { email, password } = signInCredentialsDto;

    if (password === '') {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const user = await userManager.findOne({
      where: { email },
      relations: { role: true },
    });

    if (user) {
      if (await decryptPassword(password, user.password)) return user;
    }
    throw new UnauthorizedException('Please check your login credentials');
  }
}
