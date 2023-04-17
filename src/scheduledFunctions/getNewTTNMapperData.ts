import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import logger from '@/middleware/logger';

export default class GetNewTTNMapperDataCronJob {
    private static prisma = new PrismaClient();

    public static initScheduledJob(): void {
        // https://crontab.guru/#*/*_*_*_*_*
        const ttnmapperJob = new CronJob('* * * * *', () => {
            // TTNMapperConnection.getNewTTNMapperDataForDevice();
            console.log("I'm executed every minute!");
        });

        ttnmapperJob.start();
    }

    public static async getNewTTNMapperDataForSubscribedDevices() {
        const subscribedDevices = await this.prisma.deviceSubscription.findMany();
        logger.info(`Fetching data from TTN Mapper API for ${subscribedDevices.length} subscribed devices`);
        for (const eachDeviceSubscription of subscribedDevices) {
            const apiResponse = await TTNMapperConnection.getNewTTNMapperDataForDevice(eachDeviceSubscription.deviceId);
            for (const eachTTNMapperAPIDatapoint of apiResponse.body) {
                logger.debug(
                    `Inserting new TTNMapper data ${eachTTNMapperAPIDatapoint.database_id} for Device ${eachDeviceSubscription.deviceId}`,
                );

                const deviceGPSDatapoint = await this.prisma.deviceGPSDatapoint.upsert({
                    where: {
                        deviceId_timestamp: {
                            deviceId: eachDeviceSubscription.deviceId,
                            timestamp: eachTTNMapperAPIDatapoint.time,
                        },
                    },
                    create: {
                        device: { connect: { deviceId: eachDeviceSubscription.deviceId } },
                        timestamp: eachTTNMapperAPIDatapoint.time,
                        latitude: eachTTNMapperAPIDatapoint.latitude,
                        longitude: eachTTNMapperAPIDatapoint.longitude,
                        altitude: eachTTNMapperAPIDatapoint.altitude,
                        hdop: eachTTNMapperAPIDatapoint.hdop,
                    },
                    update: {},
                });

                const gateway = await this.prisma.gateway.upsert({
                    where: { gatewayId: eachTTNMapperAPIDatapoint.gateway_id },
                    create: {
                        gatewayId: eachTTNMapperAPIDatapoint.gateway_id,
                        latitude: 0,
                        longitude: 0,
                        altitude: 0,
                    },
                    update: {
                        latitude: 0,
                        longitude: 0,
                        altitude: 0,
                    },
                });

                await this.prisma.ttnMapperDatapoint.upsert({
                    where: { id: eachTTNMapperAPIDatapoint.database_id },
                    update: {},
                    create: {
                        id: eachTTNMapperAPIDatapoint.database_id,
                        rssi: eachTTNMapperAPIDatapoint.rssi,
                        snr: eachTTNMapperAPIDatapoint.snr,
                        timestamp: eachTTNMapperAPIDatapoint.time,
                        deviceGPSDatapoint: { connect: { id: deviceGPSDatapoint.id } },
                        gateway: { connect: { gatewayId: gateway.gatewayId } },
                    },
                });
            }
        }
    }
}
