import pino, { Logger as PinoLogger, DestinationStream } from 'pino';
import path from 'path';
import fs from 'fs';
import { appConfig } from '../app.config';

const isProd = appConfig.name === 'production';
const LOG_DIR = appConfig.logger.dir;
const ALL_LOGS_FILE = path.join(LOG_DIR, appConfig.logger.appLogFile);
const ERROR_LOGS_FILE = path.join(LOG_DIR, appConfig.logger.error);

function ensureLogDirectoryExists(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function createFileDestination(filePath: string): DestinationStream {
  return pino.destination({ dest: filePath, sync: appConfig.logger.syncMode });
}

function createProdDestination(): DestinationStream {
  const allLogs = createFileDestination(ALL_LOGS_FILE);
  const errorLogs = createFileDestination(ERROR_LOGS_FILE);

  return {
    write(msg: string) {
      allLogs.write(msg);
      try {
        const log = JSON.parse(msg);
        if (pino.levels.values[log.level] >= pino.levels.values.error) {
          errorLogs.write(msg);
        }
      } catch (error) {
        errorLogs.write(error instanceof Error ? error.message : String(error));
      }
    },
  };
}

function createDevDestination(): DestinationStream {
  return pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  }) as DestinationStream;
}

function buildLogger(): PinoLogger {
  ensureLogDirectoryExists();

  const destination = isProd ? createProdDestination() : createDevDestination();

  return pino(
    {
      level: appConfig.logger.level,
      formatters: {
        level: label => ({ level: label }),
        bindings: bindings => ({ name: bindings.name || undefined }),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    destination
  );
}

function createLogger(context: string): PinoLogger {
  return baseLogger.child({ name: context });
}

// ----- Bootstrap Logger and Global Error Handling -----

const baseLogger = buildLogger();
const logger = createLogger('logger');

process.on('uncaughtException', error => {
  logger.fatal({ err: error }, 'Uncaught exception');
  logger.flush(() => process.exit(1));
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.fatal(
    { reason: reason instanceof Error ? reason.message : reason, promise },
    'Unhandled promise rejection'
  );
  logger.flush(() => process.exit(1));
});

process.on('exit', code => {
  if (code === 0) {
    logger.info('Exiting peacefully');
  } else {
    logger.error(`Exiting abnormally with code ${code}`);
  }
});

export { createLogger };
