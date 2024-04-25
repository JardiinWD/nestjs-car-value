import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';


@Injectable()
export class UsersService {
    // Define the User repository
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    /** Create a new User entity
     * @param {string} email - The email of the user
     * @param {string} password - The password of the user
     * @return {Promise<User>} The saved user from the database
     */
    create(email: string, password: string) {
        // Create a new istance for User entity
        const user = this.userRepository.create({ email, password });
        // Return the saved user from the database
        return this.userRepository.save(user);
    }

    /**  Find a user by their email.
     * @param {string} email - The email of the user to search for.
     * @return {Promise<User>} A promise that resolves to the user with the given email, or null if no user is found.
     */
    find(email: string) {
        // Find a user by their email 
        return this.userRepository.find({ where: { email } });
    }

    /** Find a user by their ID.
     * @param {number} id - The ID of the user to search for.
     * @return {Promise<User>} A promise that resolves to the user with the given ID, or null if no user is found.
     */
    findOne(id: number) {
        return this.userRepository.findOneBy({ id });
    }

    /** Update a user by their ID with the provided attributes.
     * @param {number} id - The ID of the user to update.
     * @param {Partial<User>} attrs - The attributes to update the user with.
     * @return {Promise<User>} A promise that resolves to the updated user.
     */
    async update(id: number, attrs: Partial<User>) {
        // Find a user by their ID
        const user = await this.findOne(id);
        // Check if user exists
        if (!user) throw new Error(`User with id ${id} wasn't found`);

        // Update the user
        Object.assign(user, attrs);
        // Save the user
        return this.userRepository.save(user);
    }

    /** Remove a user by their ID.
     * @param {number} id - The ID of the user to remove.
     * @return {Promise<void>} A promise that resolves when the user is removed.
     */
    async remove(id: number) {
        // Find a user by their ID
        const user = await this.findOne(id);
        // Check if user exists
        if (!user) throw new Error(`User with id ${id} wasn't found`);
        // Remove the user
        return this.userRepository.remove(user);
    }
}
