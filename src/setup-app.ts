import { ValidationPipe } from '@nestjs/common';
// Define cookie session module
const cookieSession = require('cookie-session');

/** Sets up the NestJS application by configuring cookie session and global validation pipe.
 * @param {any} app - The NestJS application instance.
 * @return {void} This function does not return anything.
 */
export const setupApp = (app: any) => {
    // Define app use for cookie session
    app.use(
        cookieSession({
            // Define cookie session keys
            keys: ['CHupiCREvOLkho']
        })
    )
    // Define global validation pipe for all endpoints because 
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }));
}