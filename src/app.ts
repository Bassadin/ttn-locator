import express, { Application } from 'express';
import pinoHttp from 'pino-http';

// Routes
import BaseRoutes from 'src/routes/base';
import TTNMapperDatapointsRoutes from 'src/routes/ttnmapper_datapoints';
import DeviceSubscriptionsRoutes from 'src/routes/device_subscriptions';
import DevicesRoutes from 'src/routes/devices';

// Error handler
import prismaErrorHandler from 'src/middleware/prismaErrorHandler';
import catchAllErrorHandler from 'src/middleware/catchAllErrorHandler';

// Fastify instance
const app: Application = express();

const pinoHttpLogger = pinoHttp();

app.use(pinoHttpLogger);

// Body parser
app.use(express.json());

// Register Routes
app.use('/', BaseRoutes);
app.use('/device_subscriptions', DeviceSubscriptionsRoutes);
app.use('/ttnmapper_datapoints', TTNMapperDatapointsRoutes);
app.use('/devices', DevicesRoutes);

// Error handler
app.use(prismaErrorHandler);
app.use(catchAllErrorHandler);

export default app;
