export default class RssiSimilarityFilter {
    constructor(
        public gatewayId: string,
        public minRssi: number,
        public maxRssi: number,
        public minSnr?: number,
        public maxSnr?: number,
    ) {}
}
