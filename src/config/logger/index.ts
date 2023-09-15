import Env from '../../utils/env';
import winston, { format } from 'winston';
// @ts-ignore
import { Papertrail } from 'winston-papertrail';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, label, printf, splat, simple } = format;

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { level, message, label, timestamp, stack, code } = info;

    if (level == 'error') {
      return `[${ level }] [${ timestamp }] ${ code != null ? `[${ code }] -> [${ message }]` : message
        } ${ code == null || code >= 500 ? `$[ERR_STACK] -> ${ stack }` : '' }`;
    }

    return `[${ level }] -> [${ timestamp }] [${ label }] -> ${ message }`;
  }),
);

const infoLogRotationTransport = new DailyRotateFile({
  filename: './/logs//info',
  datePattern: 'YYYY-MM-DD-HH:MM',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '80d',
  level: 'info',
  extension: '.log',
});

const errorLogRotationTransport = new DailyRotateFile({
  filename: './/logs//error',
  datePattern: 'YYYY-MM-DD-HH:MM',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '80d',
  level: 'error',
  extension: '.log',
});

console.log("::::::", {
  dds: Env.get<string>('PAPERTRAIL_URL'),
  kk: Env.get<string>('PAPERTRAIL_HOST')
});

const winstonPapertrail = new Papertrail({
  host: `${ Env.get<string>('PAPERTRAIL_HOST') }`.split('\r')[ 0 ],
  port: Env.get<string>('PAPERTRAIL_URL'),
  app_name: `${ Env.get<string>('NODE_ENV') }-api`,

});
const loggerInfo = (env: string) => {
  let logger;
  switch (env) {
    case 'production':
      logger = winston.createLogger({
        level: 'info',
        format: combine(
          splat(),
          simple(),
          timestamp(),
          label({ label: env }),
          logFormat
        ),
        transports: [
          infoLogRotationTransport,
          errorLogRotationTransport,
          winstonPapertrail,
          new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
          }),
        ],
        exitOnError: false,
      });
      break;
    case 'development':
      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [
          infoLogRotationTransport,
          errorLogRotationTransport,
          new winston.transports.Console(),
        ],
        exitOnError: false,
      });
      break;
    case 'test':
      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [
          infoLogRotationTransport,
          errorLogRotationTransport,
          new winston.transports.File(),
        ],
        exitOnError: false,
      });
      break;
    default:
      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [
          infoLogRotationTransport,
          errorLogRotationTransport,
          new winston.transports.Console(),
        ],
        exitOnError: false,
      });
  }

  return logger;
};

const logger = loggerInfo(Env.get<string>('NODE_ENV'));
export default class Logger {
  constructor(private readonly defaultContext: string) { }
  public static info(message: string | any, context?: string): void {
    logger.info(message, { label: context });
  }
  public static debug(message: string | any, context?: string): void {
    logger.debug(message, { label: context });
  }
  public static warn(message: string | any, context?: string): void {
    logger.warn(message, { label: context });
  }

  public static error(err: any): void {
    logger.error(err);
  }

  public info(message: string | any, context?: string) {
    logger.info(message, { label: context ?? this.defaultContext });
  }

  public error(err: any): void {
    logger.error(err);
  }

  public debug(message: string | any, context?: string): void {
    logger.debug(message, { label: context });
  }

  public warn(message: string | any, context?: string): void {
    logger.warn(message, { label: context });
  }
}
