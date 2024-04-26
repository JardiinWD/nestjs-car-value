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
    Session,
    UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserDto } from '../users/DTO/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth') // Define the controller in the auth module
@Serialize(UserDto) // Define the controller and service in the controllers and providers arrays 

// Define UsersController class with Controller decorator 
export class UsersController {

    /** Initializes a new instance of the class.
     * @param {UsersService} usersService - The service responsible for managing users.
     * @param {AuthService} authService - The service responsible for handling user authentication.
     */
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }


    /** Retrieves information about the user who is currently logged in.
     * @param {@Session()} session - the session object containing the user ID
     * @return {Promise<User>} a promise that resolves to the user object of the logged-in user
     */
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        // Return the user object of the logged-in user
        return user;
    }

    /** Sets the user ID in the session to null.
     * @param {@Session()} session - the session object
     */
    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    /** Creates a new user with the given data.
     * @param {CreateUserDto} body - The user data to be created.
     * @return {void} This function does not return anything.
     */
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        // Create a new user with the given data with the authService
        const user = await this.authService.signup(body.email, body.password);
        // Set the user ID in the session
        session.userId = user.id;
        // Return the user
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        // Sign in a user with the given data with the authService
        const user = await this.authService.signin(body.email, body.password);
        // Set the user ID in the session
        session.userId = user.id;
        // Return the user
        return user;
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
