export default class RssiSimilarityFilter {
    constructor(public gatewayId: string, public minRssi: number, public maxRssi: number) {}
}
