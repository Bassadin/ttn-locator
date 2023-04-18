import logger from '@/middleware/logger';
import superagent from 'superagent';

export default class TTNMapperConnection {
    public static async getNewTTNMapperDataForDevice(
        deviceID: string,
        startDateAndTime: Date = new Date(Date.now() - 7 * (24 * 60 * 60 * 1000)),
    ): Promise<superagent.Response> {
        if (startDateAndTime > new Date()) {
            throw new Error('startDateAndTime must be in the past');
        }
        if (!deviceID) {
            throw new Error('deviceID must be defined');
        }

        // TODO Only fetch data starting from latest timestamp in DB

        logger.info(`Getting new TTNMapper data for Device ${deviceID} from ${startDateAndTime}`);

        const apiResponse = await superagent.get(
            `https://api.ttnmapper.org/device/data?dev_id=${deviceID}&start_time=${startDateAndTime.toISOString()}`,
        );

        logger.info(`TTN Mapper api returned ${apiResponse.body.length} records for the Device ${deviceID}`);

        return apiResponse;
    }
}
