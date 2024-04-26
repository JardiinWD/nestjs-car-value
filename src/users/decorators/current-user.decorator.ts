// Import packages from NestJS
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/** Returns the current user object from the request
 * @param {never} data - The data that was passed to the decorator
 * @param {ExecutionContext} ctx - The execution context from which the request can be extracted
 * @returns The current user object
 */
export const CurrentUser = createParamDecorator(
    // Define the decorator function that returns the user object
    (data: never, ctx: ExecutionContext) => {
        // Get the request object from the context
        const request = ctx.switchToHttp().getRequest();
        // Return the user object from the request
        return request.currentUser;
    }
)
