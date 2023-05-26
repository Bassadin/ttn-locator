import prisma from '@/global/prisma';
import BaseJob from '@/scheduledFunctions/BaseJob';

export default class DeleteEmptyDeviceGpsDatapointsJob extends BaseJob {
    private static INSTANCE: DeleteEmptyDeviceGpsDatapointsJob;
    protected constructor() {
        super();
    }

    public static getInstance(): DeleteEmptyDeviceGpsDatapointsJob {
        if (!this.INSTANCE) {
            this.INSTANCE = new this();
        }

        return this.INSTANCE;
    }

    public readonly JOB_NAME = 'ClearEmptyDeviceGpsDatapoints';
    public readonly CRON_PATTERN = '0 */4 * * *';

    public override async executeJob() {
        await prisma.deviceGPSDatapoint.deleteMany({
            where: {
                ttnMapperDatapoints: {
                    none: {},
                },
            },
        });
    }
}
