import logger from '@/middleware/logger';
import superagent from 'superagent';

export default class TTNMapperConnection {
    public static async getNewTTNMapperDataForDevice(
        deviceID: string,
        daysToGetDataFor = 14,
    ): Promise<superagent.Response> {
        if (daysToGetDataFor < 1) {
            throw new Error('daysToGetDataFor must be greater than 0');
        }
        if (!deviceID) {
            throw new Error('deviceID must be defined');
        }

        const startDateAndTime: string = new Date(Date.now() - daysToGetDataFor * 24 * 60 * 60 * 1000).toISOString();

        logger.info(`Getting new TTNMapper data for Device ${deviceID} from ${startDateAndTime}`);

        const apiResponse = await superagent.get(
            `https://api.ttnmapper.org/device/data?dev_id=${deviceID}&start_time=${startDateAndTime}`,
        );

        logger.info(`TTN Mapper api returned ${apiResponse.body.length} records for the Device ${deviceID}`);

        return apiResponse;
    }
}
