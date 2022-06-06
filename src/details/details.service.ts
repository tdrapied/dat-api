import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDetailDto } from './dto/create-detail.dto';
import { Detail } from './entities/detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../locations/entities/location.entity';

@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(Detail)
    private detailRepository: Repository<Detail>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createDetailDto: CreateDetailDto): Promise<Detail> {
    const location = await this.locationRepository.findOne({
      where: { id: createDetailDto.locationId },
    });
    if (!location) {
      throw new BadRequestException('Location not exists');
    }

    const detail = new Detail();
    detail.value = createDetailDto.value;
    detail.location = location;

    return this.detailRepository.save(detail);
  }

  last(): Promise<Detail> {
    return this.detailRepository.findOne({
      order: { createdAt: 'DESC' },
    });
  }
}
