import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Define cookie session module
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Set `true` for global configuration
      envFilePath: `.env.${process.env.NODE_ENV}`, // Set the path to the .env file based on the NODE_ENV
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService], // Inject the ConfigService in the AppModule
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'sqlite', // SQLite database type
          database: configService.get<string>('DB_NAME'), // Database name from the .env file
          entities: [User, Report], // Entities to be stored in the database (Users and Reports)
          synchronize: true, // Set `true` to synchronize the database schema with the entities
        };
      },
    }),
  ],
  controllers: [AppController], // define all controller files here
  // Define inside the providers array all service files
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
  // Inject the ConfigService in the AppModule
  constructor(private configService: ConfigService) { }

  /** Configures the middleware for all routes.
   * @param {MiddlewareConsumer} consumer - The middleware consumer.
   * @return {void} This function does not return anything.
   */
  configure(consumer: MiddlewareConsumer) {
    // Define the middleware for all routes
    consumer.apply(cookieSession({
      // Define cookie session keys
      keys: [this.configService.get('COOKIE_KEY')]
    })).forRoutes('*');
  }
}
