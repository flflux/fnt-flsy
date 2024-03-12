import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app/app.module';
import session from 'express-session';
import passport = require('passport');
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:['http://143.244.136.215:4200','http://143.244.136.215:4500'],
    methods:'GET,POST,HEAD,PUT,PATCH,DELETE',
    credentials:true,
  })
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fnt-Flsy API')
    .setDescription('Fnt-Flsy API description')
    .setVersion('0.1')
    .addTag('fnt-flsy')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  //SwaggerModule.setup('swagger', app, document);
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
  Logger.log('Application running on: Http://143.244.136.215:3005');
}
bootstrap();
