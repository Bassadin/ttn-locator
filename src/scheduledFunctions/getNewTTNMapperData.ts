import { CronJob } from 'cron';

export default class GetNewTTNMapperDataCronJob {
    public static initScheduledJob(): void {
        // https://crontab.guru/#*/*_*_*_*_*
        const ttnmapperJob = new CronJob('* * * * *', () => {
            this.getNewTTNMapperData();
            console.log("I'm executed every minute!");
        });

        ttnmapperJob.start();
    }

    private static async getNewTTNMapperData(): Promise<void> {
        // TODO: Implement this with ttnmapper calls
    }
}
