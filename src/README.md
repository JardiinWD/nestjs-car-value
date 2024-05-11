# Nesj JS Summary

- [app.controller.ts](#appcontrollerts)
- [app.module.ts](#appmodulets)
- [app.service.ts](#appservicets)
- [main.ts](#maints)
- [setup-app.ts](#setupappts)

***

### App Controller

Il file `app.controller.ts` definisce il controller principale dell'applicazione Nest. All'interno di questo file, viene definita la classe `AppController`, che è responsabile per la gestione delle richieste HTTP in arrivo e per l'instradamento delle richieste ai servizi appropriati.

#### Controller Dependencies

Il controller dipende dal servizio `AppService`, che viene importato dal file `app.service.ts`.

#### Structure

Il controller è decorato con l'annotazione `@Controller()`, che indica a Nest che questa classe è un controller. All'interno del costruttore, viene iniettato il servizio `AppService` tramite Dependency Injection.

#### Methods

Attualmente, il controller non contiene alcun metodo, ma può essere esteso aggiungendo metodi decorati con le annotazioni appropriate per gestire i diversi tipi di richieste HTTP. Questo è il punto di ingresso principale per le richieste all'applicazione Nest e fornisce un'interfaccia per la gestione delle richieste e la logica di business associata.

***

### App Module

Il file `app.module.ts` definisce il modulo principale dell'applicazione Nest. Questo modulo raggruppa e configura tutti i componenti dell'applicazione, inclusi i controller, i servizi e le dipendenze.

#### Module Dependencies

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Set `true` for global configuration
      envFilePath: `.env.${process.env.NODE_ENV}`, // Set the path to the .env file based on the NODE_ENV
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService], // Inject the ConfigService in the AppModule
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'sqlite', // SQLite database type
          database: configService.get<string>('DB_NAME'), // Database name from the .env file
          entities: [User, Report], // Entities to be stored in the database (Users and Reports)
          synchronize: true, // Set `true` to synchronize the database schema with the entities
        };
      },
    }),
  ],
  controllers: [AppController], // define all controller files here
  // Define inside the providers array all service files
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ], // define all service files here
})
```

| Module Name    | Module Type    | Module Description |
|----------------|----------------|--------------------|
| ConfigModule   | Configuration  | Modulo per la gestione della configurazione dell'applicazione, utilizza un file `.env` per le impostazioni globali. |
| UsersModule    | Custom         | Modulo custom per la gestione delle funzionalità relative agli utenti dell'applicazione.              |
| ReportsModule  | Custom         | Modulo custom per la gestione delle funzionalità relative ai report generati dall'applicazione.       |
| TypeOrmModule  | ORM Integration| Modulo per l'integrazione di Nest con TypeORM, un ORM per la gestione delle operazioni di database.   |

#### Controller e Provider

Il modulo definisce i controller e i provider utilizzati nell'applicazione.

| Item        | Type  | Description |
|-------------|-------|-------------|
| controllers | Array | Contiene tutti i controller utilizzati nell'applicazione. Attualmente include solo `AppController`, ma è possibile aggiungere altri controller secondo le necessità. |
| providers   | Array | Contiene tutti i servizi utilizzati nell'applicazione. Oltre al `AppService`, include un pipe di validazione globale (`ValidationPipe`) configurato con `whitelist: true`, che applica automaticamente la validazione dei dati in ingresso a tutte le richieste HTTP. |

#### Middleware

Il modulo definisce anche un middleware globale che viene applicato a tutte le rotte dell'applicazione. Il middleware utilizza `cookie-session` per gestire le sessioni dei cookie e dipende dalla configurazione del servizio `ConfigService` per ottenere la chiave del cookie. Questo middleware viene configurato utilizzando il metodo `configure` e viene applicato a tutte le rotte utilizzando `forRoutes('*')`

```ts
export class AppModule {
  // Inject the ConfigService in the AppModule
  constructor(private configService: ConfigService) { }

  /** Configures the middleware for all routes.
   * @param {MiddlewareConsumer} consumer - The middleware consumer.
   * @return {void} This function does not return anything.
   */
  configure(consumer: MiddlewareConsumer) {
    // Define the middleware for all routes
    consumer.apply(cookieSession({
      // Define cookie session keys
      keys: [this.configService.get('COOKIE_KEY')]
    })).forRoutes('*');
  }
}
```

***

### App Service

Il file `app.service.ts` definisce il servizio principale dell'applicazione Nest. Questo servizio contiene la logica di business e fornisce funzionalità utili ai controller per elaborare le richieste HTTP e fornire risposte ai client.

#### How it works

Il servizio è definito come una classe TypeScript decorata con `@Injectable()`, che indica a Nest che questa classe può essere iniettata come dipendenza in altri componenti dell'applicazione. Attualmente, il servizio `AppService` non contiene alcuna logica di business specifica. Tuttavia, è probabile che venga esteso in futuro per aggiungere funzionalità come la gestione dei dati, l'interazione con il database, l'accesso a servizi esterni, ecc. Il servizio `AppService` può essere iniettato e utilizzato da controller, altri servizi o componenti dell'applicazione a seconda delle necessità specifiche.

***

### Main

Il file `main.ts` è il punto di ingresso dell'applicazione Nest. Questo file contiene il codice necessario per inizializzare l'applicazione, avviare il server e mettere in ascolto le richieste HTTP in arrivo.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/** Initializes the application and starts the server.
 * @return {Promise<void>} A promise that resolves when the server is listening.
 */
async function bootstrap() {
  // Define app use for cookie session 
  const app = await NestFactory.create(AppModule);
  await app.listen(5575);
}
bootstrap();
```

Il file `main.ts` definisce una funzione asincrona `bootstrap()` che viene eseguita all'avvio dell'applicazione. All'interno di questa funzione, viene creato un'istanza dell'applicazione Nest utilizzando `NestFactory.create()` e il modulo principale `AppModule` viene passato come parametro. Successivamente, l'applicazione viene avviata utilizzando il metodo `listen()`, che accetta un numero di porta come argomento. In questo caso, l'applicazione è configurata per ascoltare le richieste sulla porta `5575`.

***

### Setup App 

Il file `setup-app.ts` contiene la configurazione aggiuntiva dell'applicazione Nest. Questo file è responsabile per la configurazione di determinati aspetti dell'applicazione, come l'utilizzo di middleware e la definizione di pipe di validazione globali.

```ts
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
```

| Elemento  | Descrizione |
|-----------|-------------|
| Cookie Session Middleware | Utilizza il modulo `cookie-session` per gestire le sessioni dei cookie nell'applicazione. La configurazione include una chiave (`keys`) per firmare e crittografare i cookie delle sessioni. |
| Global Validation Pipe | Definisce una pipe di validazione globale utilizzando `ValidationPipe`, che applica automaticamente la validazione dei dati in ingresso a tutte le richieste HTTP. L'opzione `whitelist: true` viene utilizzata per rimuovere automaticamente i campi non desiderati dalle richieste in ingresso. |
