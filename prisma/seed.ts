import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const exampleDevice = await prisma.device.upsert({
        where: { deviceId: 'loris-hfu-001' },
        update: {},
        create: {
            deviceId: 'loris-hfu-001',
        },
    });
    const exampleGateway = await prisma.gateway.upsert({
        where: { gatewayId: 'testing-gateway-prisma-001' },
        update: {},
        create: {
            gatewayId: 'testing-gateway-prisma-001',
            latitude: 49.0,
            longitude: 8.0,
            altitude: 42.0,
        },
    });
    const exampleDeviceGPSDatapoint = await prisma.deviceGPSDatapoint.upsert({
        where: { id: 1 },
        update: {},
        create: {
            timestamp: new Date(2000, 1, 1),
            device: { connect: { deviceId: exampleDevice.deviceId } },
            latitude: 49.0,
            longitude: 8.0,
            altitude: 0.0,
            hdop: 0.0,
        },
    });
    const exampleTTNmapperDatapoint = await prisma.ttnMapperDatapoint.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            timestamp: new Date(),
            deviceGPSDatapoint: { connect: { id: exampleDeviceGPSDatapoint.id } },
            gateway: { connect: { gatewayId: exampleGateway.gatewayId } },
            rssi: 42,
            snr: 2,
        },
    });

    const example_device_subscription = await prisma.deviceSubscription.upsert({
        where: { deviceId: exampleDevice.deviceId },
        update: {},
        create: {
            device: { connect: { deviceId: exampleDevice.deviceId } },
        },
    });

    console.log({
        example_device: exampleDevice,
        example_gateway: exampleGateway,
        example_device_gps_datapoint: exampleDeviceGPSDatapoint,
        example_ttnmapper_datapoint: exampleTTNmapperDatapoint,
        example_device_subscription,
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
