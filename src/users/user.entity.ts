// Import decorators from TypeORM library
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// Define the User entity
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; // Primary key

    @Column()
    email: string; // Unique email address for the user

    @Column()
    password: string; // Password for the user to log in

    /* @Column({ default: true })
    admin: boolean; // Whether the user is an admin or not */
}