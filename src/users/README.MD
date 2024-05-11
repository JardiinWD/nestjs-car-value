## Users Structure

- [Decorators](#decorators)
    - [CurrentUserDecorator](#CurrentUser)
- [DTOs](#dtos)
    -[CreateUserDto](#CreateUserDto)
    -[UpdateUserDto](#UpdateUserDto)
    -[UserDto](#UserDto)
- [Guards](#guards)
    - [AdminGuard](#AdminGuard)
    - [AuthGuard](#AuthGuard)
- [Interceptors](#interceptors)
    - [CurrentUserInterceptor](#CurrentUserInterceptor)    

***

### Decorators

#### Che sono i decoratori in NestJS?

I decoratori in NestJS sono funzioni che vengono utilizzate per modificare la classe o la funzione a cui sono applicate. In questo caso, i decoratori NestJS modificano la classe o la funzione dirottando il comportamento o l'output di default.

#### Come usare i decoratori in NestJS

Per utilizzare i decoratori in NestJS, è necessario importare la funzione decorator dal pacchetto `@nestjs/common` e applicarla alla classe o alla funzione che si vuole decorare.

#### CurrentUserDecorator

Questo decorator è un semplice decorator che restituisce l'utente corrente dal contesto di richiesta.

```ts
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
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| data      | Il valore del parametro `data` è il valore che viene passato al decorator. | Nessuna validazione specifica nel decorator, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| ctx       | Il valore del parametro `ctx` è il contesto di esecuzione del decorator. | Nessuna validazione specifica nel decorator, ma dovrebbe essere gestita in modo sicuro nel sistema. |

***

### DTO

#### CreateUserDto

Questo DTO (Data Transfer Object) è utilizzato per rappresentare i dati necessari per la creazione di un nuovo utente nell'applicazione. Contiene due proprietà

```ts
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| email     | Rappresenta l'indirizzo email dell'utente.| Validato come email utilizzando `@IsEmail()` |
| password  | Rappresenta la password dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |

#### UpdateUserDto 

Questo DTO (Data Transfer Object) è utilizzato per rappresentare i dati necessari per la modifica di un utente nell'applicazione. Contiene due proprietà:

```ts
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;


    @IsString()
    @IsOptional()
    password: string;
}
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| email     | Rappresenta l'indirizzo email dell'utente.| Validato come email utilizzando `@IsEmail()` |
| password  | Rappresenta la password dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |

#### UserDto

Questo DTO (Data Transfer Object) è utilizzato per rappresentare un utente nell'applicazione. Contiene due proprietà:

```ts
export class UserDto {
    // Expose the id and email properties
    @Expose()
    id: number;

    @Expose()
    email: string;
}
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| id        | Rappresenta l'id dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| email     | Rappresenta l'indirizzo email dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |

***

### Guards

Guards in Nest JS sono delle classi che vengono utilizzate per verificare se un utente ha il permesso di accedere a un determinato endpoint. Sono utili per implementare la autenticazione e l'autorizzazione. Se il guard restituisce true, allora l'utente ha il permesso di accedere all'endpoint, altrimenti viene restituito un errore.

#### AdminGuard

Questo guard è utilizzato per verificare se l'utente ha il permesso di accedere all'endpoint. Se l'utente non ha il permesso di accedere all'endpoint, viene restituito un errore.

```ts
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
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| context   | Rappresenta l'execution context dell'endpoint da verificare. | Nessuna validazione specifica nel guard, ma dovrebbe essere gestita in modo sicuro nel sistema. |

#### AuthGuard

Questo guard è utilizzato per verificare se l'utente ha il permesso di accedere all'endpoint. Se l'utente non ha il permesso di accedere all'endpoint, viene restituito un errore.

```ts
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
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| context   | Rappresenta l'execution context dell'endpoint da verificare. | Nessuna validazione specifica nel guard, ma dovrebbe essere gestita in modo sicuro nel sistema. |

***

### Interceptors

Interceptors in Nest JS sono delle classi che vengono eseguite durante l'esecuzione di un endpoint. Sono utili per eseguire operazioni come il logging, la serializzazione dei dati o la gestione delle eccezioni. In generale, un interceptor è un pezzo di codice che viene eseguito tra due fasi: la chiamata all'endpoint e la restituzione della risposta.

#### CurrentUserInterceptor

Questa classe è un interceptor di Nest JS. Viene utilizzata per setta il campo `currentUser` nella richiesta HTTP. In questo modo, ogni endpoint può accedere all'oggetto utente corrente senza doverlo passare esplicitamente come parametro. Il campo `currentUser` contiene l'oggetto rappresentante l'utente che ha eseguito la richiesta. Questo oggetto viene ottenuto dal database utilizzando il servizio `UsersService`. Se l'utente corrente non è presente in sessione, il campo `currentUser` non viene settato.

```ts
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
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| context   | Rappresenta l'execution context dell'endpoint da intercettare. | Nessuna validazione specifica nel interceptor, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| handler   | Rappresenta il next handler da chiamare. | Nessuna validazione specifica nel interceptor, ma dovrebbe essere gestita in modo sicuro nel sistema. |