import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { PinoLoggerService } from './pino-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new PinoLoggerService();

    use (request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';

        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');

            if (/HealthChecker/gmi.test(userAgent)) {
                return;
            }
            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`, 'HTTP',
            );
        });

        next();
    }
}
