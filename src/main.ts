import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';
import { ResponseInterceptor, TransformInterceptor } from './interceptors';
import { HttpExceptionFilter } from './global-filters';

const corsOptions: NestApplicationOptions = {
  rawBody: true,
  cors: {
    origin: '*',
  },
};

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, corsOptions);
  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET')!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('Imlek-MBL API')
    .setDescription('Imlek-MBL API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ResponseInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  const port = configService.get<string>('APP_PORT');
  await app.listen(port || 3000);
  logger.log(`This application is running on: ${await app.getUrl()}`);
}
bootstrap();
