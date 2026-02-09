import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RootModules } from './modules';
import { getEnvFilePath, typeOrmModule } from './config';
import { AppLoggerMiddleware } from './common/middlewares';

const importModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: getEnvFilePath(),
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      typeOrmModule(configService, 30),
  }),
  PassportModule.register({ session: true }),
  RootModules,
];

@Module({
  imports: importModules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
