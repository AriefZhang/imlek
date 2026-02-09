import {
  Injectable,
  Logger,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { UsersRepository } from './users.repository';

import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

import { AuthService } from '../auth/auth.service';

import {
  JwtPayload,
  SignInResponse,
  JwtPayloadWithExp,
  UserRoles,
} from '../../common/types';
import { jwtOptionsWithSecret } from '../../config/jwt';
import { SignInCredentialsDto, UserCredentialsDto } from './dto';
import { handleError } from '../../common/errors';
import { PageDto, PageOptionsDto } from '../../app.dtos';
import { ServicesBase } from 'src/common/abstracts';

@Injectable()
export class UserService extends ServicesBase {
  private logger = new Logger('UserService');
  private path = '/user';
  private entityName = 'user';
  constructor(
    dataSource: DataSource,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {
    super(dataSource);
  }

  private async generateSignInResponse(user: User): Promise<SignInResponse> {
    const userId = user.id;
    const email = user.email;
    const userRole = user.role.name as UserRoles;
    const payload: JwtPayload = { userId, email, role: userRole };

    const accessToken: string = this.authService.generateToken(
      payload,
      jwtOptionsWithSecret,
    );

    await this.usersRepository.save(user);

    const response: SignInResponse = {
      userId,
      role: userRole,
      accessToken,
    };

    return response;
  }

  async create(authCredentialsDto: UserCredentialsDto): Promise<any> {
    const { queryRunner, manager } = this.getQueryManagerWithTransaction();

    try {
      const user = await this.usersRepository.createUser(
        authCredentialsDto,
        manager,
      );
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      this.logger.error(
        `Function: signUp, exception name: ${error.name}, message: ${error.message}, status: ${error.status ?? error.code}`,
      );
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        const newError = new ConflictException('Email already used');
        handleError(newError);
      } else {
        handleError(error);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<SignInResponse> {
    const user = await this.authService.validateUser(signInCredentialsDto);

    if (user) {
      return await this.generateSignInResponse(user);
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getUserData(jwtPayload: JwtPayloadWithExp): Promise<User> {
    const { userId } = jwtPayload;
    return await this.usersRepository.getUserData(userId);
  }

  async getUserDataById(userId: string): Promise<User> {
    return await this.usersRepository.getUserData(userId);
  }

  async getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return await this.usersRepository.getAllUsers(pageOptionsDto);
  }
}
