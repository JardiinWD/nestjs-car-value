import { Expose } from "class-transformer";

// Define the UserDto class
export class UserDto {
    // Expose the id and email properties
    @Expose()
    id: number;

    @Expose()
    email: string;
}