import { CanActivate, ExecutionContext } from "@nestjs/common";

// Define the AuthGuard class that implements the CanActivate interface
export class AuthGuard implements CanActivate {

    /** Determines if the user can activate the given execution context.
     * @param {ExecutionContext} context - The execution context.
     * @return {boolean} Returns true if the user can activate the context, false otherwise.
     */
    canActivate(context: ExecutionContext): boolean {
        // Get the request object from the context
        const request = context.switchToHttp().getRequest();
        // Return true if the user is authenticated, false otherwise
        return request.session?.userId;
    }
}