import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // This will help validation on dto files working
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
