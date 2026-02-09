import { join } from 'path'
import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

config()

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  entities: [
    join(__dirname, '../../modules', '**', '/entities', '*.entity.{ts,js}'),
  ],
  synchronize: process.env.NODE_ENV === 'development',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,
  // url: process.env.DATABASE_URL,
  seeds: ['dist/database/seeds/*.seeder.{js,ts}'],
}

export const dataSource = new DataSource(dataSourceOptions)
