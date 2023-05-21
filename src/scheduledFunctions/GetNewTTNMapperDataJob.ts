import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import logger from '@/middleware/logger';
import prisma from '@/global/prisma';
import TTNAPIGatewayDataResponse from '@/types/TTNAPIGatewayDataResponse';
import superagent from 'superagent';
import BaseJob from '@/scheduledFunctions/BaseJob';

export default class GetNewTTNMapperDataJob extends BaseJob {
    private static INSTANCE: GetNewTTNMapperDataJob;
    protected constructor() {
        super();
    }

    public static getInstance(): GetNewTTNMapperDataJob {
        if (!this.INSTANCE) {
            this.INSTANCE = new this();
        }

        return this.INSTANCE;
    }

    public readonly JOB_NAME = 'GetNewTTNMapperData';
    public readonly CRON_PATTERN = '0 */2 * * *';

    public override async executeJob() {
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
                // Skip invalid dates
                if (new Date(eachTTNMapperAPIDatapoint.gateway_time) <= new Date(1950, 1, 1)) {
                    logger.warn(
                        `Gateway time is invalid for TTN Mapper datapoint ${eachTTNMapperAPIDatapoint.database_id}, skipping...`,
                    );
                    continue;
                }

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
            }
        }

        logger.info(`Finished fetching data from TTN Mapper API for ${subscribedDevicesAmount} subscribed devices`);

        logger.info(`Updating metadata for ${gatewayIDsToUpdate.size} gateways.`);

        // update gateway locations, then wait for all promises to finish and log
        const promises: Promise<void>[] = [];

        for (const eachGatewayID of gatewayIDsToUpdate) {
            promises.push(this.updateMetadataForGatewaWithID(eachGatewayID));
            // TODO: update gateway name and description
            // There is https://api.ttnmapper.org/network/NS_TTS_V3%3A%2F%2Fttn%40000013/gateways but it always gets every gateway...
            // https://www.thethingsnetwork.org/gateway-data/gateway/hfu-lr8-001 this would work
        }

        await Promise.all(promises);
        logger.info(`Finished updating metadata for ${gatewayIDsToUpdate.size} gateways.`);
    }

    public async updateMetadataForGatewaWithID(gatewayID: string): Promise<void> {
        superagent
            .get(`https://www.thethingsnetwork.org/gateway-data/gateway/${gatewayID}`)
            .then(async (response) => {
                const gatewayData: TTNAPIGatewayDataResponse = response.body[gatewayID];

                await prisma.gateway.update({
                    where: { gatewayId: gatewayID },
                    data: {
                        name: gatewayData.name,
                        description: gatewayData.description,
                        latitude: gatewayData.location.latitude,
                        longitude: gatewayData.location.longitude,
                        altitude: gatewayData.location.altitude,
                        lastSeen: new Date(gatewayData.last_seen),
                    },
                });
            })
            .catch((error) => {
                logger.debug(`Error getting metadata for gateway ${gatewayID}: ${error}`);
            });
    }
}
