import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app/app.module';
import session from 'express-session';
import passport = require('passport');
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:['http://localhost:4500', 'http://localhost:4200'],
    methods:'GET,POST,HEAD,PUT,PATCH,DELETE',
    credentials:true,
  })
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hive API')
    .setDescription('Hive API description')
    .setVersion('0.1')
    .addTag('Hive')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    })
  );
  app.useGlobalPipes(new ValidationPipe());



  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3005);
  Logger.log('Application running on: Http://localhost:3005');
}
bootstrap();
