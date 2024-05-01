import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

// Define the AdminGuard class that implements the CanActivate interface
export class AdminGuard implements CanActivate {
    /** Determines if the user can activate the given execution context.
     * @param {ExecutionContext} context - The execution context.
     * @return {boolean} Returns true if the user can activate the context, false otherwise.
     */
    canActivate(context: ExecutionContext) {
        // Get the request object from the context
        const request = context.switchToHttp().getRequest();
        // Check if there is a user in the session
        if (!request.currentUser) return false
        // return true if the user is an admin
        return request.currentUser.admin
    }
}