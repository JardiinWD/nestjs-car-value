import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UsersService } from "../users.service";
import { User } from "../user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    // define the service variable
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    // define before each test where we create a fake copy of the users service
    beforeEach(async () => {
        // create a new array of users to be used in the tests
        const users: User[] = [];
        // Create a fake copy of the users service
        fakeUsersService = {
            // The find method is used to find users
            find: (email: string) => {
                // Filter the users by their email and return them
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers as User[]);
            },
            // The create method is used to create a new user
            create: (email: string, password: string) => {
                // Create a new user with the given email and password
                const user = {
                    id: Math.floor(Math.random() * 999999), // Generate a random ID 
                    email, // Set the email
                    password // Set the password
                } as User;
                // Add the user to the users array 
                users.push(user);
                // Return the user as a promise to the fake users service
                return Promise.resolve(user);
            }
        }
        // Define a test module for testing the service and its dependencies
        const module = await Test.createTestingModule({
            // Define the dependencies of the service
            providers: [
                AuthService, // The service to be tested
                {
                    provide: UsersService, // The dependency to be injected
                    useValue: fakeUsersService // The value to be injected
                }
            ]
        }).compile();
        // Get the service from the module
        service = module.get<AuthService>(AuthService);
    })


    it("Can create an istance of AuthService", async () => {
        // Assert that the service is defined
        expect(service).toBeDefined();
    })


    it("Creates a new user with a salted and hashed password", async () => {
        // Create a new user
        const user = await service.signup("MyEmail5@email.com", "123456");
        // Assert that the user has a salt
        expect(user.password).not.toEqual("123456");
        // Assert that the user has a hashed password
        const [salt, hash] = user.password.split(".");
        // Assert that the salt and hash are defined
        expect(salt).toBeDefined();
        // Assert that the hash is defined
        expect(hash).toBeDefined();
    })


    it('Throws an error if user signs up with email that is in use', async () => {
        // Invoke the signup method with an email that is already in use
        await service.signup('MyEmail5@email.com', '123456');
        await expect(service.signup('MyEmail5@email.com', '123456'))
            .rejects.toThrow(
                BadRequestException,
            );
    });


    it('Throws if signin is called with an unused email', async () => {
        // await for the signin to complete
        await expect(
            // Invoke the signin method with an email that is already in use
            service.signin('MyEmail5@email.com', '123456'),
        ).rejects.toThrow(NotFoundException);
    });


    it('Throws if an invalid password is provided', async () => {
        // await for the signup to complete
        await service.signup('MyEmail5@email.com', '123456');
        // Assert that the signin method throws an error
        await expect(service.signin('MyEmail5@email.com', '1234567'))
            .rejects.toThrow(BadRequestException);
    });


    it('Returns a user if correct password is provided', async () => {
        await service.signup('MyEmail5@email.com', '123456');
        expect(await service.signin('MyEmail5@email.com', '123456')).toBeDefined();
    });
})

