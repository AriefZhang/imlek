import { join } from 'path'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { DataSource, DataSourceOptions, LogLevel } from 'typeorm'

const ENTITIES = [
  join(__dirname, '../../modules', '**', '/entities', '*.entity.{ts,js}'),
]

const LOGGING: LogLevel[] = ['error', 'schema']

const databaseName = (configService: ConfigService) => {
  if (configService.get('NODE_ENV') === 'test') {
    return `${configService.get('DATABASE_DB_NAME')}-test`
  } else {
    return configService.get('DATABASE_DB_NAME')
  }
}

export const typeOrmModule = async (
  configService: ConfigService,
  poolSize?: number,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    entities: ENTITIES,
    synchronize: configService.get('NODE_ENV') !== 'production',
    // host: configService.get('DATABASE_HOST'),
    // port: Number(configService.get('DATABASE_PORT')),
    // username: configService.get('DATABASE_USERNAME'),
    // password: configService.get('DATABASE_PASSWORD'),
    // database: databaseName(configService),
    url: configService.get('DATABASE_URL'),
    namingStrategy: new SnakeNamingStrategy(),
    autoLoadEntities: true,
    logging: LOGGING,
    poolSize,
    extra: {
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 50,
    },
  }
}

export const getInitializedDataSource = async (
  dataSourceOptions: DataSourceOptions,
): Promise<DataSource> => {
  const dataSource = new DataSource({
    ...dataSourceOptions,
    entities: ENTITIES,
    logging: LOGGING,
  })

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }
    return dataSource
  } catch (error) {
    console.error('Error initializing data source:', error)
    throw error
  }
}
