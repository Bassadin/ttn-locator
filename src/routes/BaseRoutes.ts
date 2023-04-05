import { FastifyInstance } from 'fastify';

export default async function BaseRoutes(fastify: FastifyInstance, _options: any) {
    // 🏚️ Default Route
    // This is the Default Route of the API
    fastify.get('/', async (request, reply) => {
        reply.send({ message: 'Hello from ttnmapper-reader!' });
    });
}
