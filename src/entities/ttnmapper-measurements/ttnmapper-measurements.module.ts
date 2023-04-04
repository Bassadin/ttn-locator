import { TTNMApperMeasurementsService } from './ttnmapper-measurements.service';
import { TTNMapperMeasurement } from './ttnmapper-measurement.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TTNMapperMeasurementsController } from './ttnmapper-measurements.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TTNMapperMeasurement])],
    providers: [TTNMApperMeasurementsService],
    controllers: [TTNMapperMeasurementsController],
})
export class TTNMapperMeasurementsModule {}
