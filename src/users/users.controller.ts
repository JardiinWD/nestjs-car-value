import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
// Define UsersController class with Controller decorator 
export class UsersController {
    constructor(private usersService: UsersService) { }

    /** Creates a new user with the given data.
     * @param {CreateUserDto} body - The user data to be created.
     * @return {void} This function does not return anything.
     */
    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        // Create a new user with the given data with the UsersService
        this.usersService.create(body.email, body.password);
    }
}
