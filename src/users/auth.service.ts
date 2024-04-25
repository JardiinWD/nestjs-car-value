import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

// Define the scrypt function as a promisified version
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    // Define the User repository and the UsersService
    constructor(private usersService: UsersService) { }

    /** A description of the entire function.
     * @param {string} email - The email of the user
     * @param {string} password - The password of the user
     * @return {Promise<void>} - A promise that resolves when the user signup process is completed
     * @throws {BadRequestException} - If the user already exists
     */
    async signup(email: string, password: string) {
        // Check if the user already exists
        const users = await this.usersService.find(email);
        if (users.length) throw new BadRequestException(`User already exists with email ${email}`);
        // Hash the users password

        // 1. Generate a salt
        const salt = randomBytes(8).toString('hex');
        // 2. Hash the salt and the password
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // 3. Add the hashed password to the user object
        const result = salt + '.' + hash.toString('hex');
        // Create a new istance for User entity
        const user = await this.usersService.create(email, result);
        // Return the saved user
        return user;
    }

    /** Sign in a user with the provided email and password.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @return {Promise<User>} - The user object if the sign in is successful.
     * @throws {NotFoundException} - If the user is not found.
     * @throws {BadRequestException} - If the credentials are invalid.
     */
    async signin(email: string, password: string) {
        // Find a user by their email with the UsersService 
        const [user] = await this.usersService.find(email);
        // Check if user exists and the password is correct
        if (!user) throw new NotFoundException('User not found');
        // Check if the password is correct using the scrypt function
        const [salt, storedHash] = user.password.split('.');
        // Check if the stored hash and the password are the same
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // If the stored hash and the password are not the same, throw an error
        if (storedHash !== hash.toString('hex')) throw new BadRequestException('Invalid credentials');
        // Return the user
        return user;
    }
}