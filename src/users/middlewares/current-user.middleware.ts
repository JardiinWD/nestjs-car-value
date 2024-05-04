import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

// Define the global middleware
declare global {
    // Namaespace is required for global middleware to work
    namespace Express {
        // Define the request interface for the global middleware
        interface Request {
            // Define the current user interface
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    /** Initializes a new instance of the class.
     * @param {UsersService} usersService - The Users service.
     */
    constructor(private usersService: UsersService) { }

    /** Initializes a new instance of the class for the given request, response, and next function.
     * @param {Request} req - The incoming request object
     * @param {Response} res - The outgoing response object
     * @param {NextFunction} next - The next function in the middleware chain
     * @return {Promise<void>} A promise that resolves when the middleware chain is completed
     */
    async use(req: Request, res: Response, next: NextFunction) {
        // Get the current user from the session
        const { userId } = req.session || {};
        // Check if the current user exists in the database
        if (userId) {
            // Get the current user from the database
            const user = await this.usersService.findOne(userId);
            // Set the current user in the request
            req.currentUser = user;
        }
        // Call the next function in the middleware chain
        next();
    }
}