import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [UsersModule, ReportsModule, TypeOrmModule.forRoot({
    type: 'sqlite', // define the database type here
    database: 'db.sqlite', // define the database name here 
    entities: [User, Report], // define all entity files here
    synchronize: true, // synchronize the database `true` or `false`
  })],
  controllers: [AppController], // define all controller files here
  providers: [AppService], // define all service files here
})
export class AppModule { }
