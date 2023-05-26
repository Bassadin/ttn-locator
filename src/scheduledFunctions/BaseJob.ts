import logger from '@/middleware/logger';
import { CronJob } from 'cron';

export default abstract class BaseJob {
    public abstract readonly JOB_NAME: string;
    public abstract readonly CRON_PATTERN: string;

    /* istanbul ignore next */
    public initScheduledJob(): void {
        const ttnmapperJob = new CronJob(this.CRON_PATTERN, () => {
            logger.info(`###### Executing job ${this.JOB_NAME} with cron pattern ${this.CRON_PATTERN} ######`);
            this.executeJob();
        });

        ttnmapperJob.start();
        logger.info(`Scheduled job ${this.JOB_NAME} with cron pattern ${this.CRON_PATTERN}`);

        logger.info(`=> Executing job ${this.JOB_NAME} on startup`);
        this.executeJob();
    }

    public abstract executeJob(): void;
}
