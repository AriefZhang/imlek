import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  entities: ['dist/modules/**/entities/*.entity.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  url: process.env.DATABASE_URL,
  seeds: ['src/database/seeds/*.seeder.{js,ts}'],
  migrations: ['src/database/migrations/*.migration.{js,ts}'],
  namingStrategy: new SnakeNamingStrategy(),
  logging: ['error', 'schema'],
  extra: {
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 50,
  },
};

export const dataSource = new DataSource(dataSourceOptions);
