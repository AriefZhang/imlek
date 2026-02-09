import { SeederFactoryManager } from 'typeorm-extension';
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { UserRoles } from '../../common/types';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(`
      INSERT INTO "role" (name)
        VALUES
        ('${UserRoles.SUPER_ADMIN}'),
        ('${UserRoles.ADMIN}');
    `);
  }
}
