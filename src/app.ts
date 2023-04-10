import express, { Application } from 'express';
import pinoHttp from 'pino-http';


import BaseRoutes from './routes/base';
import TTNMapperDatapointsRoutes from './routes/ttnmapper_datapoints';
import DeviceSubscriptionsRoutes from './routes/device_subscriptions';
import DevicesRoutes from './routes/devices';

// Fix for nodemon crashes
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});

// Fastify instance
const app: Application = express();

const pinoHttpLogger = pinoHttp();

app.use(pinoHttpLogger);

// Register Routes
app.use('/', BaseRoutes);
app.use('/device_subscriptions', DeviceSubscriptionsRoutes);
app.use('/ttnmapper_datapoints', TTNMapperDatapointsRoutes);
app.use('/devices', DevicesRoutes);

export default app;
