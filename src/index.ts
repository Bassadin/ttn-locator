import express, { Application } from 'express';

import BaseRoutes from './routes/BaseRoutes';
import TTNMapperDatapointsRoutes from './routes/TTNMapperDatapoints';

// Fastify instance
const app: Application = express();

// Register Routes
app.use(BaseRoutes);
app.use(TTNMapperDatapointsRoutes);

// Run the server!
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT);
