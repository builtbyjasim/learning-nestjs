import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import logger from './utils/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') ?? 3000);
  logger.log(`Server running on port ${config.get('PORT') ?? 3000}`);
}
bootstrap();
