import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHumidityDto } from './dto/create-humidity.dto';
import { Humidity } from './entities/humidity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../locations/entities/location.entity';

@Injectable()
export class HumiditiesService {
  constructor(
    @InjectRepository(Humidity)
    private humidityRepository: Repository<Humidity>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createHumidityDto: CreateHumidityDto): Promise<Humidity> {
    const location = await this.locationRepository.findOne({
      where: { id: createHumidityDto.locationId },
    });
    if (!location) {
      throw new BadRequestException('Location not exists');
    }

    const detail = new Humidity();
    detail.value = createHumidityDto.value;
    detail.location = location;

    return this.humidityRepository.save(detail);
  }

  last(): Promise<Humidity> {
    return this.humidityRepository.findOne({
      order: { createdAt: 'DESC' },
    });
  }
}
