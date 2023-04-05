import Fastify from 'fastify';
import fastifyPrismaClient from 'fastify-prisma-client';
import BaseRoutes from './routes/BaseRoutes';
import TTNMapperDatapointsRoutes from './routes/TTNMapperDatapoints';

// Fastify instance
const fastify = Fastify({ logger: true });

// Register Prisma Client
fastify.register(fastifyPrismaClient);

// Register Routes
fastify.register(BaseRoutes);
fastify.register(TTNMapperDatapointsRoutes);

const PORT: number = parseInt(process.env.PORT || '3000');

// Run the server!
fastify.listen({ port: PORT }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.debug(`Server is now listening on ${address}`);
});
