<!-- COMPANY LOGO -->
<br />
<div align="center">
  <a href="">
    <img src="https://drive.google.com/uc?id=1SseYQru59okRfI5F7ImJdClfjK5CIB56" width="150px" alt="">
  </a>
</div>

<br />
<div align="center">

<h3 align="center">anoda_logger</h3>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

This is npm package which installs anoda_logger to your NestJS App. 
This logger can send messages to logger server to write them to db.

### Built With

* [Nest.js](https://nestjs.org/)
* [Node.js](https://nodejs.org/en/)

### Prerequisites

- Node ^16
- NestJS ^8

### Local installation


`npm install anoda_logger`

Import files to your main.ts file.

```import { Config, PinoLoggerService, asyncLocalStorage } from 'anoda_logger';```

Set up your main.ts.

```
Config.init({
        env:       //Your enviroment,
        appName:   //Your app name,
        loggerUri: // Uri for your logger server,
        loggerKey: // Logger access key,
    });

    app.useLogger(new PinoLoggerService());

    app.use((req, res, next) => {
        const traceId = req.headers['x-request-id'] || randomUUID();

        // req.headers['sentry-trace'] = traceId;
        const store = new Map().set('traceId', traceId);
        asyncLocalStorage.run(store, () => {
            next();
        });
    });
```

Import LoggerMiddleware to app.module.ts.

```import { LoggerMiddleware } from 'anoda_logger';```

Set up LoggerMiddleware.

```
export class AppModule implements NestModule {
    public configure (consumer: MiddlewareConsumer): void {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*');
    }
}
```

Copyright 2022 ANODA, all rights reserved
