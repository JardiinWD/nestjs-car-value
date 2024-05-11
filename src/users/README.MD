## Users Structure

- [Decorators](#decorators)
    - [CurrentUserDecorator](#CurrentUser)
- [DTOs](#dtos)
    - [CreateUserDto](#CreateUserDto)
    - [UpdateUserDto](#UpdateUserDto)
    - [UserDto](#UserDto)
- [Guards](#guards)
    - [AdminGuard](#AdminGuard)
    - [AuthGuard](#AuthGuard)
- [Interceptors](#interceptors)
    - [CurrentUserInterceptor](#CurrentUserInterceptor)  
- [Middlewares](#middlewares)
    - [CurrentUserMiddleware](#CurrentUserMiddleware)
- [AuthService](#authservice)
- [UsersEntity](#usersentity) 
- [UsersController](#userscontroller)
- [UsersService](#usersservice)

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

*** 

### Middlewares


#### What are middlewares in NestJS?

I middleware in NestJS sono funzioni che vengono eseguite tra la ricezione di una richiesta e l'esecuzione del controller corrispondente. Hanno la capacità di modificare la richiesta e/o la risposta prima che vengano utilizzate dal controller.

#### How to use middlewares in NestJS

Per utilizzare i middleware in NestJS, è necessario registrarli nel modulo che desideriamo utilizzare. Possiamo farlo usando il metodo `use` del `MiddlewareConsumer` che viene passato come parametro al metodo `configure` della classe `NestModule`.

Ad esempio, se vogliamo utilizzare il middleware `CurrentUserMiddleware` nel modulo `UsersModule`, dobbiamo aggiungere la seguente riga di codice nel metodo `configure` del `UsersModule`:

#### CurrentUserMiddleware

Questo middleware globale recupera l'utente corrente dalla sessione e lo memorizza nel campo `currentUser` della richiesta. In questo modo, ogni endpoint può accedere all'oggetto utente corrente senza doverlo passare esplicitamente come parametro. Il campo `currentUser` contiene l'oggetto rappresentante l'utente che ha eseguito la richiesta. Questo oggetto viene ottenuto dal database utilizzando il servizio `UsersService`. Se l'utente corrente non è presente in sessione, il campo `currentUser` non viene settato.

```ts
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
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| req       | Rappresenta la richiesta in ingresso. | Nessuna validazione specifica nel middleware, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| res       | Rappresenta la risposta in uscita. | Nessuna validazione specifica nel middleware, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| next      | Rappresenta la funzione successiva nel middleware. | Nessuna validazione specifica nel middleware, ma dovrebbe essere gestita in modo sicuro nel sistema. |

***

### Authentication Service

La classe AuthService è responsabile delle operazioni di autenticazione di un utente. Offre due metodi: signup e signin. 

#### Signup

Il metodo signup permette di registrare un nuovo utente con il servizio. Chiama il metodo create del UsersService per creare un nuovo istanza di User con i dati forniti. 

```ts
/** A description of the entire function.
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @return {Promise<void>} - A promise that resolves when the user signup process is completed
 * @throws {BadRequestException} - If the user already exists
 */
async signup(email: string, password: string) {
    // Check if the user already exists
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException(`User already exists with email ${email}`);
    // Hash the users password

    // 1. Generate a salt
    const salt = randomBytes(8).toString('hex');
    // 2. Hash the salt and the password
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // 3. Add the hashed password to the user object
    const result = salt + '.' + hash.toString('hex');
    // Create a new istance for User entity
    const user = await this.usersService.create(email, result);
    // Return the saved user
    return user;
}
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| email     | Rappresenta l'indirizzo email dell'utente.| Validato come email utilizzando `@IsEmail()` |
| password  | Rappresenta la password dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| hash      | Rappresenta la password hash dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| salt      | Rappresenta la password salt dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| user      | Rappresenta l'utente creato. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |

#### Signin

Il metodo signin permette di effettuare l'accesso di un utente. Chiama il metodo find del UsersService per trovare l'utente con l'email fornita e poi verifica la password usando la funzione scrypt. Se l'utente esiste e la password è corretta restituisce l'utente. Se l'utente non esiste o la password è errata lancia un'eccezione.

```ts
/** Sign in a user with the provided email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<User>} - The user object if the sign in is successful.
 * @throws {NotFoundException} - If the user is not found.
 * @throws {BadRequestException} - If the credentials are invalid.
 */
async signin(email: string, password: string) {
    // Find a user by their email with the UsersService 
    const [user] = await this.usersService.find(email);
    // Check if user exists and the password is correct
    if (!user) throw new NotFoundException('User not found');
    // Check if the password is correct using the scrypt function
    const [salt, storedHash] = user.password.split('.');
    // Check if the stored hash and the password are the same
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // If the stored hash and the password are not the same, throw an error
    if (storedHash !== hash.toString('hex')) throw new BadRequestException('Invalid credentials');
    // Return the user
    return user;
}
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| email     | Rappresenta l'indirizzo email dell'utente.| Validato come email utilizzando `@IsEmail()` |
| password  | Rappresenta la password dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| hash      | Rappresenta la password hash dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| salt      | Rappresenta la password salt dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| user      | Rappresenta l'utente creato. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |

***

### Entities

In NestJS, le Entità (Entities) sono classi che rappresentano i dati che verranno salvati nel database. In generale, le Entità sono il modello a oggetti che verranno utilizzate dall'applicazione per gestire i dati. Le Entità devono essere annotate con i decoratori `@Entity` e `@Column` per definire la struttura del database.

```ts
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; // Primary key

    @Column()
    email: string; // Unique email address for the user

    @Column()
    password: string; // Password for the user to log in

    @Column({ default: false })
    admin: boolean; // Flag to indicate if the user is an admin

    // Define the relationship between the User and Report entities
    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]; // Reports created by the user

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id: ', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with id: ', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed User with id: ', this.id);
    }
}
```

| Proprietà | Descrizione | Validazione |
|-----------|-------------|-------------|
| id        | Rappresenta l'id dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| email     | Rappresenta l'indirizzo email dell'utente.| Validato come email utilizzando `@IsEmail()` |
| password  | Rappresenta la password dell'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| admin     | Rappresenta se l'utente è un admin. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| reports   | Rappresenta i report creati dall'utente. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| @Entity   | Rappresenta l'annotazione per definire la struttura del database. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| @Column   | Rappresenta l'annotazione per definire la struttura del dato nel database. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| @OneToMany | Rappresenta l'annotazione per definire la relazione One-to-Many tra User e Report. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| @AfterInsert() | Rappresenta l'annotazione per registrare l'eventuale azione dopo l'inserimento. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| @AfterUpdate() | Rappresenta l'annotazione per registrare l'eventuale azione dopo l'aggiornamento. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |
| @AfterRemove() | Rappresenta l'annotazione per registrare l'eventuale azione dopo la rimozione. | Nessuna validazione specifica nel DTO, ma dovrebbe essere gestita in modo sicuro nel sistema. |

***

### UsersController

#### Definition

I controller sono una parte fondamentale dell'architettura del nostro sistema. Essi sono responsabili della gestione delle richieste HTTP in ingresso e della generazione delle rispettive risposte. In altre parole, controllano il flusso delle richieste e delle risposte tra il client e il nostro sistema.

Il nostro sistema dispone di diversi controller, ognuno dei quali è responsabile di una specifica parte del nostro sistema. Ad esempio, il controller UsersController è responsabile della gestione delle richieste relative all'utente. In particolare, il nostro controller UsersController si occupa di gestire le seguenti operazioni:

* Creare un nuovo utente
* Recuperare un utente con un determinato id
* Aggiornare le informazioni di un utente
* Eliminare un utente
* Effettuare l'accesso di un utente

In sintesi, il nostro controller UsersController è responsabile della gestione delle informazioni relative agli utenti e delle loro operazioni.

#### Methods

| Method | Description | Parameters | Return type |
| --- | --- | --- | --- |
| `whoAmI` | Retrieves information about the user who is currently logged in. | `session`: The session object containing the user ID | `Promise<User>` |
| `signout` | Sets the user ID in the session to null. | `session`: The session object | `void` |
| `createUser` | Creates a new user with the given data. | `body`: The user data to be created, `session`: The session object | `Promise<User>` |
| `signin` | Sign in a user with the given data. | `body`: The user data to be signed in, `session`: The session object | `Promise<User>` |
| `findUser` | Find a user by their ID with the UsersService. | `id`: The ID of the user to find | `Promise<User>` |
| `findAllUsers` | Find all users by their email with the UsersService. | `email`: The email of the users to search for | `Promise<User[]>` |
| `removeUser` | Removes a user by their ID using the UsersService. | `id`: The ID of the user to remove | `Promise<void>` |
| `updateUser` | Updates a user by their ID using the UsersService. | `id`: The ID of the user to update, `body`: The updated user data | `Promise<User>` |
| `@Controller('auth')` | Define the auth controller and its routes. | `@Controller('auth')` | `void` |
| `@Serialize(UserDto)` | Define the UserDto class with the @Serialize decorator. | `@Serialize(UserDto)` | `void` |

***

### UsersService

#### Definition

Il nostro UserService è un modulo che si occupa di gestire l'interazione con l'utente. In altre parole, il nostro UserService è responsabile della gestione delle operazioni relative agli utenti. 

#### Methods

| Method | Description | Parameters | Return type |
| --- | --- | --- | --- |
| `createUser` | Creates a new user with the given data. | `body`: The user data to be created | `Promise<User>` |
| `findUser` | Find a user by their ID with the UsersService. | `id`: The ID of the user to find | `Promise<User>` |
| `findAllUsers` | Find all users by their email with the UsersService. | `email`: The email of the users to search for | `Promise<User[]>` |
| `removeUser` | Removes a user by their ID using the UsersService. | `id`: The ID of the user to remove | `Promise<void>` |
| `updateUser` | Updates a user by their ID using the UsersService. | `id`: The ID of the user to update, `body`: The updated user data | `Promise<User>` |

***