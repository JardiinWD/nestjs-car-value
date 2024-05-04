import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  // Define the User entity in the imports array of the UsersModule
  imports: [TypeOrmModule.forFeature([User])],
  // Define the controller and service in the controllers and providers arrays
  controllers: [UsersController],
  // Define the service in the providers array
  providers: [UsersService, AuthService]
})
export class UsersModule {

  /** Configures the middleware for all routes.
   * @param {MiddlewareConsumer} consumer - The middleware consumer.
   * @return {void} This function does not return anything.
   */
  configure(consumer: MiddlewareConsumer) {
    // Define the middleware for all routes
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes('*');
  }
}
