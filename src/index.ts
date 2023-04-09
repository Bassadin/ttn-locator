import express, { Application } from 'express';
import pino from 'pino-http';

import BaseRoutes from './routes/base';
import TTNMapperDatapointsRoutes from './routes/ttnmapper_datapoints';
import DeviceSubscriptionsRoutes from './routes/device_subscriptions';

// Fastify instance
const app: Application = express();

app.use(pino);

// Register Routes
app.use(BaseRoutes);
app.use('/device_subscriptions', DeviceSubscriptionsRoutes);
app.use('/ttnmapper_datapoints', TTNMapperDatapointsRoutes);

// Run the server!
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT);
