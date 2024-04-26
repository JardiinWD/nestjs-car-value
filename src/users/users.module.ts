import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  // Define the User entity in the imports array of the UsersModule
  imports: [TypeOrmModule.forFeature([User])],
  // Define the controller and service in the controllers and providers arrays
  controllers: [UsersController],
  // Define the service in the providers array
  providers: [UsersService, AuthService, CurrentUserInterceptor]
})
export class UsersModule {

}
