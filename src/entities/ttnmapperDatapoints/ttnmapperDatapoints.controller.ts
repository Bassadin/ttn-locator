import { TTNMapperDatapointsService } from './ttnmapperDatapoints.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class TTNMapperDatapointssController {
    constructor(
        private readonly ttnMapperMeasurementsService: TTNMapperDatapointsService,
    ) {}

    @Get()
    getAll() {
        return this.ttnMapperMeasurementsService.findAll();
    }
}
