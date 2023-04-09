import express, { Application } from 'express';

import BaseRoutes from './routes/base';
import TTNMapperDatapointsRoutes from './routes/ttnmapper_datapoints';
import DeviceSubscriptionsRoutes from './routes/device_subscriptions';

// Fastify instance
const app: Application = express();

// Register Routes
app.use(BaseRoutes);
app.use('/ttnmapper_datapoints', TTNMapperDatapointsRoutes);
app.use('/device_subscriptions', DeviceSubscriptionsRoutes);

// Run the server!
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT);
