import { LoggerService } from '@nestjs/common';
import { pino as pinoLogger } from 'pino';
import { asyncLocalStorage } from './async-storage';
import axios from 'axios';
import { LogObj } from './interfaces';
import { setTimeout } from 'node:timers';
import { AnodaConfig } from './logger-config';


const pino = pinoLogger({
    prettyPrint: true,
});


export class AnodaLogger implements LoggerService {
    private logData: LogObj[];
    private isRunning: boolean;
    private env: string;
    private appName: string;
    private loggerUri: string;
    private loggerKey: string;


    constructor () {
        this.logData = [];
        this.isRunning = false;
        this.env = AnodaConfig.env;
        this.appName = AnodaConfig.appName;
        this.loggerUri = AnodaConfig.loggerUri;
        this.loggerKey = AnodaConfig.loggerKey;
    }

    private getMessage (message: any, context?: string, traceId = 'System message') {
        if (message instanceof Object) {
            message = message.toString();
        }
        return context ? ` [ ${context} ] ${message} ${traceId}` : ` ${message} ${traceId}`;
    }

    error (message: any, context?: string, ...optionalParameters: any[]): any {
        // @ts-ignore
        const traceId = asyncLocalStorage.getStore()?.get('traceId');

        if (message instanceof Object) {
            pino.error({ ...message }, this.getMessage(message.msg, context, traceId));
        }
        else {
            pino.error(this.getMessage(message, context, traceId));
        }
        this.sendLog(message, context, traceId);
    }

    log (message: any, context?: string, ...optionalParameters: any[]): any {
        // @ts-ignore
        const traceId = asyncLocalStorage.getStore()?.get('traceId');

        if (message instanceof Object) {
            pino.info({ ...message }, this.getMessage(message.msg, context, traceId));
        }
        else {
            pino.info(this.getMessage(message, context, traceId));
        }
        this.sendLog(message, context, traceId);
    }

    warn (message: any, context?: string, ...optionalParameters: any[]): any {
        // @ts-ignore
        const traceId = asyncLocalStorage.getStore()?.get('traceId');

        if (message instanceof Object) {
            pino.warn({ ...message }, this.getMessage(message.msg, context, traceId));
        }
        else {
            pino.warn(this.getMessage(message, context, traceId));
        }
        this.sendLog(message, context, traceId);
    }

    debug (message: any, context?: string, ...optionalParameters: any[]): any {

        // @ts-ignore
        const traceId = asyncLocalStorage.getStore()?.get('traceId');


        if (message instanceof Object) {
            pino.debug({ ...message }, this.getMessage(message.msg, context, traceId));
        }
        else {
            pino.debug(this.getMessage(message, context, traceId));
        }

        this.sendLog(message, context, traceId);
    }

    private sendLog (message: string | object, context: string, traceId: string) {
        if (message instanceof Object) {
            message = message.toString();
        }

        this.logData.push({
            timestamp: (new Date()).toISOString(),
            context,
            message,
            traceId,
            env:       this.env,
        });

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        setTimeout(() => {
            const body = {
                project: this.appName,
                logData: this.logData,
            };
            axios.post(this.loggerUri, body, {
                headers: {
                    'x-access-token': this.loggerKey,
                },
            }).then(() => {
                this.logData = [];
            }).catch(() => {
                return console.log('Send log error');
            }).finally(() => {
                this.isRunning = false;
            });
        }, 2000);
    }
}

