import { FastifyInstance } from 'fastify';

export default async function TTNMapperDatapointsRoutes(fastify: FastifyInstance, _options: any) {
    // Create new user
    // This is the Route for creating a new user via POST Method
    fastify.get('/ttnmapper_datapoints', async (request, reply) => {
        const ttnmapper_datapoints = await fastify.prisma.ttnmapper_datapoint.findMany();
        reply.send({ message: 'success', data: ttnmapper_datapoints });
    });
}
