import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { AuthService } from '../auth/auth.service';

import { JwtPayload, RoleId, UserRoles } from '../../common/types';
import { UserCredentialsDto } from './dto';
import { encryptPassword } from '../../common/helpers';
import { handleError } from '../../common/errors';
import { jwtOptionsWithSecret } from '../../config';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/app.dtos';

@Injectable()
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository');
  constructor(
    private dataSource: DataSource,
    private authService: AuthService,
  ) {
    super(User, dataSource.createEntityManager());
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const [entities, itemCount] = await this.findAndCount({
      order: { id: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async createUser(
    userCredentialsDto: UserCredentialsDto,
    manager: EntityManager,
  ): Promise<User> {
    const userManager = manager.getRepository(User);

    const { email, password } = userCredentialsDto;
    const defaultRoles = {
      id: RoleId.ADMIN,
      roleName: UserRoles.ADMIN,
    };

    const hashedPassword = await encryptPassword(password);
    const user = this.create({
      email,
      password: hashedPassword,
      role: defaultRoles,
    });
    return await userManager.save(user);
  }

  async getUserData(id: string): Promise<User> {
    const user = await this.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
