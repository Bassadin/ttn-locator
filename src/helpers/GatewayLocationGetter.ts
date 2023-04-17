import GatewayLocation from '@/dataclasses/GatewayLocation';
import logger from '@/middleware/logger';
import superagent from 'superagent';

export default class GatewayLocationGetter {
    public static async getGatewayLocation(gatewayId: string): Promise<GatewayLocation> {
        logger.info(`Fetching location for gateway ${gatewayId}`);

        const responseData = await superagent.get(
            `https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${gatewayId}`,
        );

        const reponseGatewayLocation = responseData.body.location;

        return new GatewayLocation(
            reponseGatewayLocation.latitude,
            reponseGatewayLocation.longitude,
            reponseGatewayLocation.altitude,
        );
    }
}
