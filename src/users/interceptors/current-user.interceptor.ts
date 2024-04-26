// Import packages for interceptor usage
import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    /** Initializes a new instance of the class.
     * @param {UsersService} usersService - The Users service.
     */
    constructor(private usersService: UsersService) { }

    /** Intercepts the execution context and calls the next handler.
     * @param {ExecutionContext} context - The execution context.
     * @param {CallHandler} handler - The next handler to be called.
     * @return {Promise<Observable<any>>} A promise that resolves to an observable of any type.
     */
    async intercept(context: ExecutionContext, handler: CallHandler) {
        // Get the current user from the session
        const request = context.switchToHttp().getRequest();
        // Get the current userID from the session
        const { userId } = request.session || {};
        // Check if the current user exists in the database
        if (userId) {
            // Get the current user from the database
            const user = await this.usersService.findOne(userId);
            // Set the current user in the request
            request.currentUser = user;
        }
        // Call the next handler
        return handler.handle();
    }
}