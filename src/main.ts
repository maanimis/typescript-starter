import { createLogger } from './logger';
import { appConfig } from './app.config';

const logger = createLogger('app');
logger.info('Enviroment: ' + appConfig.name);

async function main() {}

main();
