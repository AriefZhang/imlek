import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class TruncateTableSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(`
      TRUNCATE
        "user",
        "role",
        "stand",
        "item",
        "transaction",
        "item_transaction",
      RESTART IDENTITY CASCADE;
    `);
  }
}
