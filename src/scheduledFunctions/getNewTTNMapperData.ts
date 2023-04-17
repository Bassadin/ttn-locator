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
        for (const eachDevice of subscribedDevices) {
            const apiResponse = await TTNMapperConnection.getNewTTNMapperDataForDevice(eachDevice.deviceId);
            for (const eachTTNMapperData of apiResponse.body) {
                logger.debug(`Inserting new TTNMapper data ${eachTTNMapperData} for Device ${eachDevice.deviceId}`);
            }
        }
    }
}
