import { SeederFactoryManager } from 'typeorm-extension';
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { RoleId } from '../../common/types';
import { encryptPassword } from '../../common/helpers';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const hashedPassword = await encryptPassword(
      process.env.SUPER_ADMIN_PASSWORD!,
    );

    await dataSource.query(`
      INSERT INTO "user" (email, password, role_id)
        VALUES
        ('mblimlek.su@yopmail.com', '${hashedPassword}', '${RoleId.SUPER_ADMIN}');
    `);
  }
}
