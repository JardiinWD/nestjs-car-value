import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  // define the controller variable
  let controller: UsersController;
  // define the fake users service
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;


  beforeEach(async () => {
    // define the fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email: 'MyEmail@email.com', password: 'mypassword' } as User])
      },
      /* update: () => { },
      remove: () => { }, */
      findOne: (id: number) => {
        return Promise.resolve({ id: id, email: 'MyEmail@email.com', password: 'mypassword' } as User)
      }
    }
    // define the fake copy of the auth service
    fakeAuthService = {
      /* signup: () => { }, */
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email: 'MyEmail@email.com', password: 'mypassword' } as User)
      },
    }

    // define the testing module
    const module: TestingModule = await Test.createTestingModule({
      // The controller to be tested 
      controllers: [UsersController],
      // The providers to be injected
      providers: [
        {
          provide: UsersService, // The dependency to be injected
          useValue: fakeUsersService // The value to be injected
        },
        {
          provide: AuthService, // The dependency to be injected
          useValue: fakeAuthService // The value to be injected
        }
      ]
    }).compile();
    // Get the controller from the module
    controller = module.get<UsersController>(UsersController);
  });


  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('Find User returns a user with given id', async () => {
    // Invoke the findUser method and expect it to return a user
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });


  it('findAllUsers returns a list of users with the given email', async () => {
    // Invoke the findAllUsers method and expect it to return a list of users
    const users = await controller.findAllUsers('MyEmail@email.com');
    // Assert that the list of users contains a user with the given email
    expect(users.length).toEqual(1);
    // Assert that the user in the list has the correct email
    expect(users[0].email).toEqual('MyEmail@email.com');
  });


  it('Find User throws an error if user with given id is not found', async () => {
    // Invoke the findUser method and expect it to throw an error
    fakeUsersService.findOne = () => null;
    // Assert that the findUser method throws an error
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });


  it('Signin update session object and return user', async () => {
    // Create a session object and set its userId to -10
    const session = { userId: -10 };
    // Invoke the signin method and expect it to return a user
    const user = await controller.signin({ email: 'MyEmail@email.com', password: 'mypassword' }, session);
    // Assert that the user has the correct id and userId
    expect(user.id).toEqual(1);
    // Assert that the session has the correct userId
    expect(session.userId).toEqual(1);
  });

});
