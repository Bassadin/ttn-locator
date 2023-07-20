import prisma from '@/global/prisma';
import RssiSimilarityFilter from '@/types/RssiSimilarityFilter';
import { DeviceGPSDatapoint } from '@prisma/client';

export default class DeviceGPSDatapointsHelper {
    public static async getMatchingDeviceGPSDatapointsFromFilter(
        similarityFilter: RssiSimilarityFilter[],
    ): Promise<DeviceGPSDatapoint[]> {
        // TODO: Not sure how to do this without any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prismaFilterQuery: any = {
            AND: [],
        };

        for (const filterCriteria of similarityFilter) {
            const filterCondition: any = {
                gateway: {
                    gatewayId: filterCriteria.gatewayId,
                },
                rssi: {
                    gte: filterCriteria.minRssi,
                    lte: filterCriteria.maxRssi,
                },
            };

            if (filterCriteria.minSnr && filterCriteria.maxSnr) {
                filterCondition.snr = {
                    gte: filterCriteria.minSnr,
                    lte: filterCriteria.maxSnr,
                };
            }

            prismaFilterQuery.AND.push({
                ttnMapperDatapoints: {
                    some: filterCondition,
                },
            });
        }

        return prisma.deviceGPSDatapoint.findMany({ where: prismaFilterQuery });
    }
}
