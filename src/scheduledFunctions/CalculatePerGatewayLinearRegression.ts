import prisma from '@/global/prisma';
import logger from '@/middleware/logger';
import BaseJob from '@/scheduledFunctions/BaseJob';

export default class CalculatePerGatewayLinearRegressionJob extends BaseJob {
    private static INSTANCE: CalculatePerGatewayLinearRegressionJob;
    protected constructor() {
        super();
    }

    public static getInstance(): CalculatePerGatewayLinearRegressionJob {
        if (!this.INSTANCE) {
            this.INSTANCE = new this();
        }

        return this.INSTANCE;
    }

    public readonly JOB_NAME = 'CalculatePerGatewayLinearRegression';
    public readonly CRON_PATTERN = '0 */2 * * *';

    public override async executeJob() {
        await prisma.$executeRaw`
            UPDATE "Gateway"
            SET "linearRegressionSlope" = subquery.slope,
                "linearRegressionIntercept" = subquery.intercept
            FROM (
                SELECT
                    "Gateway"."gatewayId",
                    regr_slope(
                        ST_DistanceSphere(
                            ST_MakePoint("Gateway"."longitude", "Gateway"."latitude"),
                            ST_MakePoint("DeviceGPSDatapoint"."longitude", "DeviceGPSDatapoint"."latitude")),
                        "TtnMapperDatapoint"."rssi"
                    ) AS slope,
                    regr_intercept(
                        ST_DistanceSphere(
                            ST_MakePoint("Gateway"."longitude", "Gateway"."latitude"),
                            ST_MakePoint("DeviceGPSDatapoint"."longitude", "DeviceGPSDatapoint"."latitude")),
                        "TtnMapperDatapoint"."rssi"
                    ) AS intercept
                FROM "Gateway"
                JOIN "TtnMapperDatapoint" ON "TtnMapperDatapoint"."gatewayId" = "Gateway"."gatewayId"
                JOIN "DeviceGPSDatapoint" ON "DeviceGPSDatapoint"."id" = "TtnMapperDatapoint"."deviceGPSDatapointId"
                GROUP BY "Gateway"."gatewayId"
                HAVING COUNT(*) >= 500
            ) AS subquery
            WHERE "Gateway"."gatewayId" = subquery."gatewayId";
        `;

        logger.info(`Updated linear regression for gateways.`);
    }
}
