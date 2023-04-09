import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const example_device = await prisma.device.upsert({
        where: { device_id: 'loris-tracker-hfu' },
        update: {},
        create: {
            device_id: 'loris-tracker-hfu',
        },
    });
    const example_gateway = await prisma.gateway.upsert({
        where: { gateway_id: 'mikrotik-lr8-001' },
        update: {},
        create: {
            gateway_id: 'mikrotik-lr8-001',
            latitude: 49.0,
            longitude: 8.0,
        },
    });
    const example_device_gps_datapoint = await prisma.device_gps_datapoint.upsert({
        where: { id: 1 },
        update: {},
        create: {
            timestamp: new Date(),
            device: { connect: { device_id: example_device.device_id } },
            latitude: 49.0,
            longitude: 8.0,
            altitude: 0.0,
            hdop: 0.0,
        },
    });
    const example_ttnmapper_datapoint = await prisma.ttnmapper_datapoint.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            timestamp: new Date(),
            device_gps_datapoint: { connect: { id: example_device_gps_datapoint.id } },
            gateway: { connect: { gateway_id: example_gateway.gateway_id } },
            rssi: 42,
            snr: 2,
        },
    });

    const example_device_subscription = await prisma.device_subscription.upsert({
        where: { device_id: example_device.device_id },
        update: {},
        create: {
            device: { connect: { device_id: example_device.device_id } },
        },
    });

    console.log({
        example_device,
        example_gateway,
        example_device_gps_datapoint,
        example_ttnmapper_datapoint,
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
