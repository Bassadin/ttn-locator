import logger from '@/middleware/logger';
import superagent from 'superagent';

export default class TTNMapperConnection {
    public static async getNewTTNMapperDataForDevice(
        deviceID: string,
        daysToGetDataFor = 7,
    ): Promise<superagent.Response> {
        const endDateAndTime: string = new Date().toISOString(); // current time in ISO timestamp format
        const startDateAndTime: string = new Date(Date.now() - daysToGetDataFor * 24 * 60 * 60 * 1000).toISOString();

        logger.info(`Getting new TTNMapper data for device ${deviceID} from ${startDateAndTime} to ${endDateAndTime}`);

        const apiResponse = await superagent.get(
            `https://api.ttnmapper.org/device/data?dev_id=${deviceID}&start_time=${startDateAndTime}&end_time=${endDateAndTime}`,
        );

        logger.info(`TTN Mapper api returned ${apiResponse.body.length} records for the device ${deviceID}`);

        return apiResponse;
    }
}
