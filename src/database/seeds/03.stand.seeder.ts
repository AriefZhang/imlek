import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class CountrySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(`
      INSERT INTO "stand" (name)
        VALUES
        ('Stand 1'),
        ('Stand 2'),
        ('Stand 3'),
        ('Stand 4'),
        ('Stand 5');
    `);
  }
}
