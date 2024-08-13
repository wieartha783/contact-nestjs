import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston'; // Import WinstonModule
import { winstonLogger } from './config/winston-logger'; // Import your custom logger

// This will enable variable from .env can be accessed from anywhere
dotenv.config();

async function bootstrap() {
  const loggerWinston = {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  };

  // Create the app with the Winston logger
  const app = await NestFactory.create(AppModule, loggerWinston);

  // This will help validation on DTO files working
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
