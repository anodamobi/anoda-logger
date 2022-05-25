<!-- COMPANY LOGO -->
<br />
<div align="center">
  <a href="">
    <img src="https://drive.google.com/uc?export=view&id=1d5ggFl97Cyh806YF_NQX1Z7wevXODDoj" width="150px" alt="">
  </a>
</div>

<br />
<div align="center">

<h3 align="center">anoda-logger</h3>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

This is npm package which installs anoda-logger to your NestJS App. 
This logger can send messages to logger server to write them to db.

### Built With

* [Nest.js](https://nestjs.org/)
* [Node.js](https://nodejs.org/en/)

### Prerequisites

- Node ^16
- NestJS ^8

### Local installation


`npm install anoda-logger`

Import files to your main.ts file.

```import { AnodaMiddleware, AnodaConfig, AnodaLogger } from 'anoda-logger';```

Set up your main.ts.

```
AnodaConfig.init({
        env:       //Your enviroment,
        appName:   //Your app name,
        loggerUri: // Uri for your logger server,
        loggerKey: // Logger access key,
    });

    app.useLogger(new AnodaLogger());
    app.use(AnodaMiddleware);
    
```

Import LoggerMiddleware to app.module.ts.

```import { LoggerMiddleware } from 'anoda-logger';```

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
