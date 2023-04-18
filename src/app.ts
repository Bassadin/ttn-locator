import express, { Application } from 'express';
import pinoHttp from 'pino-http';
import logger from '@/middleware/logger';

// Routes
import BaseRoutes from '@/routes/base';
import TTNMapperDatapointsRoutes from '@/routes/ttnmapper_datapoints';
import DeviceSubscriptionsRoutes from '@/routes/device_subscriptions';
import DevicesRoutes from '@/routes/devices';
import { GPS_DATAPOINTS_ROUTE_NAME, deviceGpsDatapointsRoutes } from '@/routes/device_gps_datapoints';

// Error handler
import prismaErrorHandler from '@/middleware/prismaErrorHandler';
import catchAllErrorHandler from '@/middleware/catchAllErrorHandler';

// Scheduled jobs
import GetNewTTNMapperDataCronJob from './scheduledFunctions/getNewTTNMapperData';

// Fastify instance
const app: Application = express();

const pinoHttpLogger = pinoHttp({
    logger: logger,
    autoLogging: {
        ignore: (req) => ['/healthcheck', '/metrics'].includes(<string>req.url),
    },
});

app.use(pinoHttpLogger);

// Body parser
app.use(express.json());

// Register Routes
app.use('/', BaseRoutes);
app.use('/device_subscriptions', DeviceSubscriptionsRoutes);
app.use('/ttnmapper_datapoints', TTNMapperDatapointsRoutes);
app.use('/devices', DevicesRoutes);
app.use(`/${GPS_DATAPOINTS_ROUTE_NAME}`, deviceGpsDatapointsRoutes);

// Error handler
app.use(prismaErrorHandler);
app.use(catchAllErrorHandler);

// Init scheduled jobs
/* istanbul ignore next  */
if (process.env.NODE_ENV != 'testing') {
    GetNewTTNMapperDataCronJob.initScheduledJob();
}

/* istanbul ignore next  */
if (process.env.NODE_ENV == 'development') {
    GetNewTTNMapperDataCronJob.getNewTTNMapperDataForSubscribedDevices();
}

export default app;
