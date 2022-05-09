import {asyncLocalStorage} from './async-storage'
import {randomUUID} from "crypto";

export const AnodaMiddleware = (req, res, next) => {
    const traceId = req.headers['x-request-id'] || randomUUID();

    // req.headers['sentry-trace'] = traceId;
    const store = new Map().set('traceId', traceId);
    asyncLocalStorage.run(store, () => {
        next();
    });
}

