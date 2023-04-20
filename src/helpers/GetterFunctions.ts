import prisma from '@/global/prisma';

export default class GetterFunctions {
    public static async getAmountOfDeviceSubscriptions(): Promise<number> {
        return await prisma.device.count({
            where: {
                subscription: true,
            },
        });
    }
}
