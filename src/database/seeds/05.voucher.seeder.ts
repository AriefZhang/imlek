import { SeederFactoryManager } from 'typeorm-extension';
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class VoucherSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(`
      INSERT INTO "voucher" (code, type, value)
        VALUES
        ('V-5000', 'Voucher 5000', 5000),
        ('V-10000', 'Voucher 10000', 10000);
    `);
  }
}
