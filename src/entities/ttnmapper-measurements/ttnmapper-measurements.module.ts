import { TTNMApperMeasurementsService } from './ttnmapper-measurements.service';
import { TTNMapperMeasurement } from './ttnmapper-measurement.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([TTNMapperMeasurement])],
    providers: [TTNMApperMeasurementsService],
    controllers: [UsersController],
})
export class TTNMapperMeasurementsModule {}
