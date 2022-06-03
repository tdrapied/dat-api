import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetailDto } from './dto/create-detail.dto';
import { Detail } from './entities/detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(Detail)
    private detailRepository: Repository<Detail>,
  ) {}

  create(createDetailDto: CreateDetailDto): Promise<Detail> {
    const detail = new Detail();
    detail.value = createDetailDto.value;

    return this.detailRepository.save(detail);
  }

  async last(): Promise<Detail> {
    const detail = await this.detailRepository.findOne({
      order: { createdAt: 'DESC' },
    });
    if (!detail) {
      throw new NotFoundException();
    }
    return detail;
  }

  findDetails(locationId: string): Promise<Detail[]> {
    return this.detailRepository.find({
      where: { location: { id: locationId } },
    });
  }
}
