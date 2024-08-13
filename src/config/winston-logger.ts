import { Logtail } from '@logtail/node';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

// Initialize Logtail with your source token from .env
const logtail = new Logtail(process.env.LOGTAIL_TOKEN ?? '');

// Custom Logtail transport for Winston
const logtailTransport = new winston.transports.Console({
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));
    logtail.log(info).then(() => callback());
  },
});

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike(),
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    logtailTransport, // Log to Logtail
  ],
});

// Optionally, add an unhandled exception handler
winstonLogger.exceptions.handle(
  new winston.transports.Console(),
  logtailTransport,
);
