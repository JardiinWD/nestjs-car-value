import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Define global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(5575);
}
bootstrap();
