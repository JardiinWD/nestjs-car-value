import { IsEmail, IsString, IsOptional } from "class-validator";

// Define UpdateUserDto class
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;


    @IsString()
    @IsOptional()
    password: string;
}