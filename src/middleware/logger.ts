import pino from 'pino';

const logger = pino();

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
    logger.warn('Running in development mode');
    logger.level = 'debug';
}

export default logger;
