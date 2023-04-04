import { TTNMApperMeasurementsService } from './ttnmapper-measurements.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class TTNMapperMeasurementsController {
    constructor(
        private readonly ttnMapperMeasurementsService: TTNMApperMeasurementsService,
    ) {}

    @Get()
    getAll() {
        return this.ttnMapperMeasurementsService.findAll();
    }
}
