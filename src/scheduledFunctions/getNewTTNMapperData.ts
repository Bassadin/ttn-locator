import { CronJob } from 'cron';
import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import logger from '@/middleware/logger';
import GatewayLocationGetter from '@/helpers/GatewayLocationGetter';
import Location from '@/dataclasses/Location';
import prisma from '@/global/prisma';

export default class GetNewTTNMapperDataCronJob {
    /* istanbul ignore next */
    public static initScheduledJob(): void {
        // https://crontab.guru/#0_*/2_*_*_* (Every 2 hours)
        const ttnmapperJob = new CronJob('0 */2 * * *', () => {
            this.getNewTTNMapperDataForSubscribedDevices();
        });

        ttnmapperJob.start();
        logger.info('Scheduled job for fetching data from TTN Mapper initialized');
    }

    public static async getNewTTNMapperDataForSubscribedDevices() {
        const subscribedDevices = await prisma.device.findMany({
            where: {
                subscription: true,
            },
        });
        const subscribedDevicesAmount = subscribedDevices.length;

        if (subscribedDevicesAmount === 0) {
            logger.warn('No device subscriptions found, skipping TTN Mapper API fetch');
            return;
        }

        logger.info(`=> Fetching data from TTN Mapper API for ${subscribedDevicesAmount} subscribed devices`);

        const gatewayIDsToUpdate: Set<string> = new Set();

        for (const eachDeviceSubscription of subscribedDevices) {
            const ttnMapperApiResponse = await TTNMapperConnection.getNewTTNMapperDataForDevice(
                eachDeviceSubscription.deviceId,
                await TTNMapperConnection.getTtnMapperApiStartSearchDateForDevice(eachDeviceSubscription.deviceId),
            );
            for (const eachTTNMapperAPIDatapoint of ttnMapperApiResponse) {
                logger.debug(
                    `=> Inserting new TTNMapper data ${eachTTNMapperAPIDatapoint.database_id} for Device ${eachDeviceSubscription.deviceId}`,
                );

                const deviceGPSDatapoint = await prisma.deviceGPSDatapoint.upsert({
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
                const gateway = await prisma.gateway.upsert({
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

                if (new Date(eachTTNMapperAPIDatapoint.gateway_time) > new Date(1900, 1, 1)) {
                    await prisma.ttnMapperDatapoint.upsert({
                        where: { id: eachTTNMapperAPIDatapoint.database_id },
                        update: {},
                        create: {
                            id: eachTTNMapperAPIDatapoint.database_id,
                            rssi: eachTTNMapperAPIDatapoint.rssi,
                            snr: eachTTNMapperAPIDatapoint.snr,
                            timestamp: eachTTNMapperAPIDatapoint.gateway_time,
                            deviceGPSDatapoint: { connect: { id: deviceGPSDatapoint.id } },
                            gateway: { connect: { gatewayId: gateway.gatewayId } },
                        },
                    });
                } else {
                    logger.warn(
                        `Gateway time is invalid for TTN Mapper datapoint ${eachTTNMapperAPIDatapoint.database_id}, skipping...`,
                    );
                }
            }
        }

        logger.info(`Finished fetching data from TTN Mapper API for ${subscribedDevicesAmount} subscribed devices`);

        logger.info(`Updating ${gatewayIDsToUpdate.size} gateway locations`);

        // update gateway locations, then wait for all promises to finish and log
        const promises: Promise<void>[] = [];

        for (const eachGatewayID of gatewayIDsToUpdate) {
            promises.push(this.updateGatewayLocation(eachGatewayID));
        }

        await Promise.all(promises);
        logger.info(`Finished updating ${gatewayIDsToUpdate.size} gateway locations`);
    }

    public static async updateGatewayLocation(gatewayID: string): Promise<void> {
        GatewayLocationGetter.getGatewayLocationFromPacketBrokerAPI(gatewayID)
            .then(async (gatewayLocation: Location) => {
                // TODO: Why is the await needed here?
                await prisma.gateway.update({
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
