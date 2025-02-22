import prisma from '@/global/prisma';
import logger from '@/middleware/logger';
import TTNMapperGatewayAPIDeviceGPSDatapoint from '@/types/TTNMapperGatewayAPIDeviceGPSDatapoint';
import superagent from 'superagent';

export default class TTNMapperConnection {
    public static async getNewTTNMapperDataForDevice(
        deviceID: string,
        startDateAndTime: Date,
    ): Promise<TTNMapperGatewayAPIDeviceGPSDatapoint[]> {
        if (startDateAndTime > new Date()) {
            throw new Error('startDateAndTime must be in the past');
        }
        if (!deviceID) {
            throw new Error('deviceID must be defined');
        }

        // TODO Only fetch data starting from latest timestamp in DB

        logger.info(`Getting new TTNMapper data for Device ${deviceID} from ${startDateAndTime}`);

        const ttnMapperApiUrl = `https://api.ttnmapper.org/device/data?dev_id=${deviceID}&start_time=${startDateAndTime.toISOString()}`;

        logger.debug(`Calling TTN Mapper api with url ${ttnMapperApiUrl}`);

        const apiResponse = await superagent.get(ttnMapperApiUrl).timeout({
            response: 8 * 1000,
            deadline: 10 * 1000,
        });

        if (apiResponse.body.success == false || apiResponse.body == undefined) {
            throw new Error(`TTN Mapper api errored: ${JSON.stringify(apiResponse.body)}`);
        }

        logger.info(`TTN Mapper api returned ${apiResponse.body.length} records for the Device ${deviceID}`);

        return apiResponse.body;
    }

    public static async getTtnMapperApiStartSearchDateForDevice(deviceID: string): Promise<Date> {
        if (!deviceID) {
            throw new Error('deviceID must be defined');
        }

        // Use 180 days as fallback
        const fallbackDate = new Date(Date.now() - 180 * (24 * 60 * 60 * 1000));

        const latestDeviceGPSDatapoint = await prisma.deviceGPSDatapoint.findFirst({
            where: {
                device: {
                    deviceId: deviceID,
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
            select: {
                timestamp: true,
            },
        });

        if (!latestDeviceGPSDatapoint) {
            logger.info(`No TTNMapper data found for Device ${deviceID}, using fallback start date ${fallbackDate}`);
            return fallbackDate;
        }

        logger.info(
            `Found latest TTNMapper data for Device ${deviceID}, using latest timestamp ${latestDeviceGPSDatapoint.timestamp} as start date for TTNMapper API call`,
        );

        return new Date(latestDeviceGPSDatapoint.timestamp.getTime());
    }
}
