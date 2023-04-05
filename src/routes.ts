import { FastifyInstance } from 'fastify';

export default async function routes(fastify: FastifyInstance, _options: any) {
    // 🏚️ Default Route
    // This is the Default Route of the API
    fastify.get('/', async (request, reply) => {
        reply.send({ message: 'Hello from ttnmapper-reader!' });
    });

    // Create new user
    // This is the Route for creating a new user via POST Method
    fastify.get('/ttnmapper_datapoints', async (request, reply) => {
        const ttnmapper_datapoints = await fastify.prisma.ttnmapper_datapoint.findMany();
        reply.send({ message: 'success', data: ttnmapper_datapoints });
    });
}
