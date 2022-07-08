import { Injectable } from '@nestjs/common';
import { CreateHumidityDto } from './dto/create-humidity.dto';
import { Humidity } from './entities/humidity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class HumiditiesService {
  constructor(
    @InjectRepository(Humidity)
    private humidityRepository: Repository<Humidity>,
    private locationService: LocationsService,
  ) {}

  async create(
    locationId: string,
    createHumidityDto: CreateHumidityDto,
  ): Promise<Humidity> {
    const location = await this.locationService.getLocationIfExists(locationId);

    const humidity = new Humidity();
    humidity.value = createHumidityDto.value;
    humidity.location = location;

    return this.humidityRepository.save(humidity);
  }

  async last(locationId: string): Promise<Humidity> {
    const location = await this.locationService.getLocationIfExists(locationId);

    return this.humidityRepository.findOne({
      where: { location },
      order: { createdAt: 'DESC' },
    });
  }
}
