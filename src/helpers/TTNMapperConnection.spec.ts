import prisma from '@/global/prisma';
import TTNMapperConnection from '@/helpers/TTNMapperConnection';

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

    describe('getNewTTNMapperDataForDevice()', () => {
        test('Calling getNewTTNMapperDataForDevice() method without device id', async () => {
            expect(async () => {
                await TTNMapperConnection.getNewTTNMapperDataForDevice('', new Date(2005, 1, 1));
            }).rejects.toThrowError();
        });

        test('Calling getNewTTNMapperDataForDevice() method with a date in the future', async () => {
            expect(async () => {
                await TTNMapperConnection.getNewTTNMapperDataForDevice('test_device', new Date(3000, 1, 1));
            }).rejects.toThrowError();
        });
    });

    describe('getTtnMapperApiStartSearchDateForDevice()', () => {
        test('Calling getTtnMapperApiStartSearchDateForDevice() method with a valid device id', async () => {
            expect(await TTNMapperConnection.getTtnMapperApiStartSearchDateForDevice('loris-hfu-001')).toBeInstanceOf(
                Date,
            );
        });

        test('Calling getTtnMapperApiStartSearchDateForDevice() method with an empty device id', async () => {
            expect(async () => {
                await TTNMapperConnection.getTtnMapperApiStartSearchDateForDevice('');
            }).rejects.toThrowError();
        });
    });
    test('Calling getNewTTNMapperDataForDevice() method without device id', async () => {
        expect(async () => {
            await TTNMapperConnection.getNewTTNMapperDataForDevice('', new Date(2005, 1, 1));
        }).rejects.toThrowError();
    });

    test('Calling getNewTTNMapperDataForDevice() method with a date in the future', async () => {
        expect(async () => {
            await TTNMapperConnection.getNewTTNMapperDataForDevice('test_device', new Date(3000, 1, 1));
        }).rejects.toThrowError();
    });

    test('Calling getTtnMapperApiStartSearchDateForDevice() method with a valid device id', async () => {
        expect(await TTNMapperConnection.getTtnMapperApiStartSearchDateForDevice('loris-hfu-001')).toBeInstanceOf(Date);
    });

    test('Calling getTtnMapperApiStartSearchDateForDevice() method with an empty device id', async () => {
        expect(async () => {
            await TTNMapperConnection.getTtnMapperApiStartSearchDateForDevice('');
        }).rejects.toThrowError();
    });
});
