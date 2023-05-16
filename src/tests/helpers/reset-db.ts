import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
    await prisma.$transaction([
        prisma.ttnMapperDatapoint.deleteMany(),
        prisma.deviceGPSDatapoint.deleteMany(),
        prisma.gateway.deleteMany(),
        prisma.device.deleteMany(),
    ]);
};
