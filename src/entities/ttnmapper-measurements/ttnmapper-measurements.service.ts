import { TTNMapperMeasurement } from './ttnmapper-measurement.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TTNMApperMeasurementsService {
    constructor(
        @InjectRepository(TTNMapperMeasurement)
        private ttnmapperMeasurementsRepository: Repository<TTNMapperMeasurement>,
    ) {}

    findAll(): Promise<TTNMapperMeasurement[]> {
        return this.ttnmapperMeasurementsRepository.find();
    }

    findOne(id: number): Promise<TTNMapperMeasurement | null> {
        return this.ttnmapperMeasurementsRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.ttnmapperMeasurementsRepository.delete(id);
    }
}
