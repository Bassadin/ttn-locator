import { CronJob } from 'cron';

export default class GetNewTTNMapperDataCronJob {
    public static initScheduledJob(): void {
        // https://crontab.guru/#*/5_*_*_*_*
        const ttnmapperJob = new CronJob('* * * * *', () => {
            console.log("I'm executed every minute!");
            // TODO: Implement this with ttnmapper calls
        });

        ttnmapperJob.start();
    }
}
