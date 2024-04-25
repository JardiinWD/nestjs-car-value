import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// Define cookie session module
const cookieSession = require('cookie-session');


/** Initializes the application and starts the server.
 * @return {Promise<void>} A promise that resolves when the server is listening.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Define app use for cookie session
  app.use(
    cookieSession({
      // Define cookie session keys
      keys: ['CHupiCREvOLkho']
    })
  )
  // Define global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(5575);
}
bootstrap();
