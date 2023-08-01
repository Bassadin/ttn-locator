import prisma from '@/global/prisma';
import logger from '@/middleware/logger';
import TTNMapperGatewayAPIDeviceGPSDatapoint from '@/types/TTNMapperGatewayAPIDeviceGPSDatapoint';
import superagent from 'superagent';

export default class AddSpreadingFactorRetroactively {
    public static async updateExistingDeviceGpsDatapoints(): Promise<number> {
        logger.info('Updating existing device gps datapoints with spreading factor');

        const allSubscribedDevices = await prisma.device.findMany({
            where: {
                subscription: true,
            },
            select: {
                deviceId: true,
                deviceGPSDatapoints: {
                    orderBy: {
                        timestamp: 'asc',
                    },
                    take: 1,
                    select: {
                        timestamp: true,
                    },
                },
            },
        });

        logger.info(`Found ${allSubscribedDevices.length} subscribed devices, performing spreading factor update`);

        for (const eachDevice of allSubscribedDevices) {
            const deviceID = eachDevice.deviceId;

            // get timestamp of earliest deviceGPSDatapoint without spreading factor
            const earliestDeviceGPSDatapointWithoutSpreadingFactor = await prisma.deviceGPSDatapoint.findFirst({
                where: {
                    device: {
                        deviceId: deviceID,
                    },
                    spreadingFactor: null,
                },
                orderBy: {
                    timestamp: 'asc',
                },
                select: {
                    timestamp: true,
                },
            });

            if (!earliestDeviceGPSDatapointWithoutSpreadingFactor) {
                logger.info(`No datapoints without spreading factor found for Device ${deviceID}`);
                continue;
            }

            const ttnMapperApiUrl = `https://api.ttnmapper.org/device/data?dev_id=${deviceID}&start_time=${earliestDeviceGPSDatapointWithoutSpreadingFactor.timestamp.toISOString()}`;

            logger.debug(`Calling TTN Mapper api with url ${ttnMapperApiUrl}`);

            const apiResponse = await superagent.get(ttnMapperApiUrl).timeout({
                response: 8 * 1000,
                deadline: 10 * 1000,
            });

            if (apiResponse.body.success == false || apiResponse.body == undefined) {
                throw new Error(`TTN Mapper api errored: ${JSON.stringify(apiResponse.body)}`);
            }

            const ttnMapperApiData: TTNMapperGatewayAPIDeviceGPSDatapoint[] = await apiResponse.body;

            logger.info(`TTN Mapper api returned ${apiResponse.body.length} records for the Device ${deviceID}`);

            for (const datapoint of ttnMapperApiData) {
                // check if deviceGPSDatapoint already exists
                const existingDatapoint = await prisma.deviceGPSDatapoint.findUnique({
                    where: {
                        deviceId_timestamp: {
                            deviceId: datapoint.dev_id,
                            timestamp: datapoint.time,
                        },
                    },
                    select: {
                        spreadingFactor: true,
                    },
                });

                if (!existingDatapoint || existingDatapoint.spreadingFactor != null) {
                    continue;
                }

                await prisma.deviceGPSDatapoint.update({
                    where: {
                        deviceId_timestamp: {
                            deviceId: datapoint.dev_id,
                            timestamp: datapoint.time,
                        },
                    },
                    data: {
                        spreadingFactor: datapoint.spreading_factor,
                    },
                });
            }

            logger.info(`Updated ${ttnMapperApiData.length} datapoints for Device ${deviceID}`);
        }

        // print number of device gps datapoints without spreading factor
        const deviceGPSDatapointsWithoutSpreadingFactor = await prisma.deviceGPSDatapoint.findMany({
            where: {
                spreadingFactor: null,
            },
        });

        logger.info(
            `Number of device gps datapoints without spreading factor: ${deviceGPSDatapointsWithoutSpreadingFactor.length}`,
        );

        return deviceGPSDatapointsWithoutSpreadingFactor.length;
    }
}
