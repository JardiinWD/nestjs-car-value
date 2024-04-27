import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/** Initializes the application and starts the server.
 * @return {Promise<void>} A promise that resolves when the server is listening.
 */
async function bootstrap() {
  // Define app use for cookie session 
  const app = await NestFactory.create(AppModule);
  await app.listen(5575);
}
bootstrap();
