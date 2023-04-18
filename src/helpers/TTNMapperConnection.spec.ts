import { PrismaClient } from '@prisma/client';
import TTNMapperConnection from '@/helpers/TTNMapperConnection';

const prisma = new PrismaClient();

describe('Test TTNMapperConnection class', () => {
    test('Test inserting duplicate datapoint', async () => {
        const exampleDevice = await prisma.device.upsert({
            where: { deviceId: 'duplicate_test_001' },
            update: {},
            create: {
                deviceId: 'duplicate_test_001',
            },
        });

        const dataForExampleGPSDatapoint = {
            timestamp: new Date(2005, 1, 1),
            latitude: 333.0,
            longitude: 999.0,
            altitude: 1337.0,
            hdop: 0.0,
        };

        await prisma.deviceGPSDatapoint.deleteMany({ where: dataForExampleGPSDatapoint });

        await prisma.deviceGPSDatapoint.create({
            data: { ...dataForExampleGPSDatapoint, device: { connect: { deviceId: exampleDevice.deviceId } } },
        });

        await expect(async () => {
            await prisma.deviceGPSDatapoint.create({
                data: { ...dataForExampleGPSDatapoint, device: { connect: { deviceId: exampleDevice.deviceId } } },
            });
        }).rejects.toThrowError();

        await prisma.deviceGPSDatapoint.deleteMany({ where: dataForExampleGPSDatapoint });
    });

    test('Calling getNewTTNMapperDataForDevice() method with negative amount of days', async () => {
        expect(async () => {
            await TTNMapperConnection.getNewTTNMapperDataForDevice('test', -1);
        }).rejects.toThrowError();
    });

    test('Calling getNewTTNMapperDataForDevice() method without device id', async () => {
        expect(async () => {
            await TTNMapperConnection.getNewTTNMapperDataForDevice('', 1);
        }).rejects.toThrowError();
    });
});
