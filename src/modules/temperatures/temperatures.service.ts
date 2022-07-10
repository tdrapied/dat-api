import { Injectable } from '@nestjs/common';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationsService } from '../locations/locations.service';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Temperature, TemperatureType } from './entities/temperature.entity';

@Injectable()
export class TemperaturesService {
  constructor(
    @InjectRepository(Temperature)
    private readonly temperatureRepository: Repository<Temperature>,
    private locationService: LocationsService,
  ) {}

  async create(
    locationId: string,
    createTemperatureDto: CreateTemperatureDto,
  ): Promise<Temperature> {
    if (createTemperatureDto.type === TemperatureType.SOIL) {
      throw new Error('SOIL type is not supported currently');
    }

    const location = await this.locationService.getLocationIfExists(locationId);

    const temperature = new Temperature();
    temperature.value = createTemperatureDto.value;
    temperature.type = createTemperatureDto.type;
    temperature.location = location;

    return this.temperatureRepository.save(temperature);
  }

  async lastAir(locationId: string): Promise<Temperature> {
    const location = await this.locationService.getLocationIfExists(locationId);

    return this.temperatureRepository.findOne({
      where: {
        type: TemperatureType.AIR,
        location,
        createdAt: LessThanOrEqual(new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }
}
