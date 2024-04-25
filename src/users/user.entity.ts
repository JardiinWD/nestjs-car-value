// Import decorators from TypeORM library
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    AfterInsert,
    AfterRemove,
    AfterUpdate
} from "typeorm";


// Define the User entity
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; // Primary key

    @Column()
    email: string; // Unique email address for the user

    @Column()
    password: string; // Password for the user to log in

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id: ', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with id: ', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed User with id: ', this.id);
    }
}