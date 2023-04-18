import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import logger from '@/middleware/logger';
import GatewayLocationGetter from '@/helpers/GatewayLocationGetter';
import Location from '@/dataclasses/Location';

export default class GetNewTTNMapperDataCronJob {
    private static prisma = new PrismaClient();

    /* istanbul ignore next */
    public static initScheduledJob(): void {
        // https://crontab.guru/#0_*/2_*_*_* (Every 2 hours)
        const ttnmapperJob = new CronJob('0 */2 * * *', () => {
            this.getNewTTNMapperDataForSubscribedDevices();
        });

        ttnmapperJob.start();
    }

    public static async getNewTTNMapperDataForSubscribedDevices() {
        const subscribedDevices = await this.prisma.deviceSubscription.findMany();
        logger.info(`=> Fetching data from TTN Mapper API for ${subscribedDevices.length} subscribed devices`);

        const gatewayIDsToUpdate: Set<string> = new Set();

        for (const eachDeviceSubscription of subscribedDevices) {
            const ttnMapperApiResponse = await TTNMapperConnection.getNewTTNMapperDataForDevice(
                eachDeviceSubscription.deviceId,
                await TTNMapperConnection.getTtnMapperApiStartSearchDateForDevice(eachDeviceSubscription.deviceId),
            );
            for (const eachTTNMapperAPIDatapoint of ttnMapperApiResponse.body) {
                logger.debug(
                    `=> Inserting new TTNMapper data ${eachTTNMapperAPIDatapoint.database_id} for Device ${eachDeviceSubscription.deviceId}`,
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

                // Locations will be updated later
                const gateway = await this.prisma.gateway.upsert({
                    where: { gatewayId: eachTTNMapperAPIDatapoint.gateway_id },
                    create: {
                        gatewayId: eachTTNMapperAPIDatapoint.gateway_id,
                        latitude: 0,
                        longitude: 0,
                        altitude: 0,
                    },
                    update: {},
                });

                gatewayIDsToUpdate.add(gateway.gatewayId);

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

        logger.info(`Finished fetching data from TTN Mapper API for ${subscribedDevices.length} subscribed devices`);

        // Update the gateway locations
        logger.info(`Updating ${gatewayIDsToUpdate.size} gateway locations`);
        for (const eachGatewayID of gatewayIDsToUpdate) {
            this.updateGatewayLocation(eachGatewayID);
        }
        logger.info(`Finished updating ${gatewayIDsToUpdate.size} gateway locations`);
    }

    public static async updateGatewayLocation(gatewayID: string): Promise<void> {
        GatewayLocationGetter.getGatewayLocation(gatewayID)
            .then(async (gatewayLocation: Location) => {
                // TODO: Why is the await needed here?
                await this.prisma.gateway.update({
                    where: { gatewayId: gatewayID },
                    data: {
                        latitude: gatewayLocation.latitude,
                        longitude: gatewayLocation.longitude,
                        altitude: gatewayLocation.altitude,
                    },
                });
                logger.debug(`Updated location for gateway ${gatewayID}`);
            })
            .catch((error) => {
                logger.debug(`Error getting location for gateway ${gatewayID}: ${error}`);
            });
    }
}
