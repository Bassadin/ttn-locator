import pino from 'pino';
import pretty from 'pino-pretty';

let loggerOptions = {};

if (process.env.NODE_ENV === 'testing') {
    // https://github.com/pinojs/pino-pretty#usage-with-jest
    loggerOptions = pretty({ sync: true });
}

const logger = pino(loggerOptions);

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
    logger.level = 'debug';
}

logger.info(`Logger initialized, running in ${process.env.NODE_ENV} mode`);

export default logger;
