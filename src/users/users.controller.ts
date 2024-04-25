// Import decorators from nestjs
import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Param,
    Query,
    Delete,
    NotFoundException,
    UseInterceptors
} from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/DTO/user.dto';

@Controller('auth')
@Serialize(UserDto)
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

    /** Find a user by their ID with the UsersService.
     * @param {string} id - The ID of the user to find.
     * @interceptor {Serialize} A custom made serialize from interceptor
     * @return {Promise<User>} A promise that resolves to the user with the given ID, or null if no user is found.
     * @throws {NotFoundException} If the user is not found.
     */
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        // Find a user by their ID with the UsersService
        const user = await this.usersService.findOne(parseInt(id));
        // Check if user exists
        if (!user) throw new NotFoundException(`User with id ${id} wasn't found`);
        // Return the user if it exists
        return user;
    }


    /** Find all users by their email with the UsersService.
     * @param {string} email - The email of the users to search for.
     * @return {Promise<User[]>} A promise that resolves to an array of users matching the given email.
     */
    @Get()
    findAllUsers(@Query('email') email: string) {
        // Find all users by their email with the UsersService
        return this.usersService.find(email);
    }

    /** Removes a user by their ID using the UsersService.
     * @param {string} id - The ID of the user to remove.
     * @return {Promise<void>} A promise that resolves when the user is removed.
     */
    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        // Remove a user by their ID with the UsersService  
        return this.usersService.remove(parseInt(id));
    }

    /** Updates a user by their ID using the UsersService.
     * @param {string} id - The ID of the user to update.
     * @param {UpdateUserDto} body - The updated user data.
     * @return {Promise<User>} A promise that resolves to the updated user.
     */
    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        // Update a user by their ID with the UsersService
        return this.usersService.update(parseInt(id), body);
    }
}
