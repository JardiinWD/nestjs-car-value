import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
// Define cookie session module
const cookieSession = require('cookie-session');

@Module({
  imports: [UsersModule, ReportsModule, TypeOrmModule.forRoot({
    type: 'sqlite', // define the database type here
    database: 'db.sqlite', // define the database name here 
    entities: [User, Report], // define all entity files here
    synchronize: true, // synchronize the database `true` or `false`
  })],
  controllers: [AppController], // define all controller files here
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ], // define all service files here
})
export class AppModule {

  /** Configures the middleware for all routes.
   * @param {MiddlewareConsumer} consumer - The middleware consumer.
   * @return {void} This function does not return anything.
   */
  configure(consumer: MiddlewareConsumer) {
    // Define the middleware for all routes
    consumer.apply(cookieSession({
      // Define cookie session keys
      keys: ['CHupiCREvOLkho']
    })).forRoutes('*');
  }
}
