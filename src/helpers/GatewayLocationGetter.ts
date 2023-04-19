import Location from '@/dataclasses/Location';
import logger from '@/middleware/logger';
import superagent from 'superagent';

export default class GatewayLocationGetter {
    public static async getGatewayLocationFromPacketBrokerAPI(gatewayId: string): Promise<Location> {
        logger.debug(`Fetching location for gateway ${gatewayId}`);

        const responseData = await superagent.get(
            `https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${gatewayId}`,
        );

        const reponseGatewayLocation = responseData.body.location;

        return new Location(
            reponseGatewayLocation.latitude,
            reponseGatewayLocation.longitude,
            reponseGatewayLocation.altitude,
        );
    }
}
