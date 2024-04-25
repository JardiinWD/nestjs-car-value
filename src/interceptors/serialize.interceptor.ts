import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'


/** Returns a NestJS interceptor that serializes the response data using the provided DTO.
 * @param {any} dto - The DTO class to use for serialization.
 * @return {UseInterceptors} - The NestJS interceptor that serializes the response data.
 */
export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto))
}


export class SerializeInterceptor implements NestInterceptor {

    /** The constructor of the class. 
     * @param {any} dto - The parameter representing a generic dto type
     */
    constructor(private dto: any) { }

    /** A description of the entire function.
     * @param {ExecutionContext} context - The execution context
     * @param {CallHandler} handler - The call handler
     * @return {Observable<any>} The observable with transformed data
     */
    intercept(
        context: ExecutionContext,
        handler: CallHandler
    ): Observable<any> {
        // Get the next handler to be executed
        return handler.handle().pipe(
            // Map the data to be transformed
            map((data: any) => {
                // Return the transformed data to the next handler
                return plainToClass(this.dto, data, {
                    // Exclude extraneous properties from the transformed data
                    excludeExtraneousValues: true
                })
            })
        )
    }
}