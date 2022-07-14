import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHumidityDto } from './dto/create-humidity.dto';
import { Humidity } from './entities/humidity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { LocationsService } from '../locations/locations.service';
import { SearchHumidityDto } from './dto/search-humidity.dto';
import { StatHumidityModel } from './models/stat-humidity.model';

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

  async findAll(
    locationId: string,
    searchHumidityDto: SearchHumidityDto,
  ): Promise<StatHumidityModel[]> {
    if (
      searchHumidityDto.from > new Date() ||
      searchHumidityDto.to > new Date() ||
      searchHumidityDto.from >= searchHumidityDto.to
    ) {
      throw new BadRequestException('Invalid date range');
    }

    const location = await this.locationService.getLocationIfExists(locationId);

    // Set global query parameters
    const qb = this.humidityRepository
      .createQueryBuilder('h')
      .select([
        'MIN(h.value) as min',
        'AVG(h.value) as mean',
        'MAX(h.value) as max',
        'MIN(h.createdAt) as from',
        'MAX(h.createdAt) as to',
        'EXTRACT(MONTH FROM h.createdAt) as month',
        'EXTRACT(YEAR FROM h.createdAt) as year',
      ])
      .where({
        location,
      })
      .andWhere('h.createdAt BETWEEN :from AND :to', {
        from: searchHumidityDto.from,
        to: searchHumidityDto.to,
      })
      .orderBy('year, month');

    // If the difference is less than 1 day, we want to group by 5 minutes
    if (
      searchHumidityDto.to <
      new Date(searchHumidityDto.from.getTime() + 3600 * 1000 * 24)
    ) {
      qb.addSelect([
        'EXTRACT(HOUR FROM h.createdAt) as hour',
        'EXTRACT(DAY FROM h.createdAt) as day',
        'CASE WHEN EXTRACT(MINUTE FROM "createdAt") = 0 THEN 5 ' +
          'ELSE CASE WHEN EXTRACT(MINUTE FROM "createdAt")::numeric % 5 != 0 ' +
          'THEN (FLOOR(EXTRACT(MINUTE FROM "createdAt")::numeric / 5) + 1) * 5 ' +
          'ELSE EXTRACT(MINUTE FROM "createdAt") END END AS "minute_group"',
      ]);

      qb.groupBy('minute_group, hour, day, month, year');
      qb.addOrderBy('year, month, day, hour, minute_group', 'ASC');
    }
    // Else if the difference is less than or equal to 7 days (1 week), we want to group by hour
    else if (
      searchHumidityDto.to <=
      new Date(searchHumidityDto.from.getTime() + 3600 * 1000 * 24 * 7)
    ) {
      qb.addSelect([
        'EXTRACT(HOUR FROM h.createdAt) as hour',
        'EXTRACT(day FROM h.createdAt) as day',
      ]);

      qb.groupBy('hour, day, month, year');
      qb.addOrderBy('year, month, day, hour', 'ASC');
    }
    // Else if the difference is less than or equal to 90 days, we want to group by day
    else if (
      searchHumidityDto.to <=
      new Date(searchHumidityDto.from.getTime() + 3600 * 1000 * 24 * 90)
    ) {
      qb.addSelect(['EXTRACT(day FROM h.createdAt) as day']);

      qb.groupBy('day, month, year');
      qb.addOrderBy('year, month, day', 'ASC');
    }
    // Else if the difference is less than or equal to 365 days, we want to group by month
    else if (
      searchHumidityDto.to <=
      new Date(searchHumidityDto.from.getTime() + 3600 * 1000 * 24 * 365)
    ) {
      qb.addSelect(['EXTRACT(WEEK FROM h.createdAt) as week']);

      qb.groupBy('week, month, year');
      qb.addOrderBy('year, month, week', 'ASC');
    }
    // Else we want to group by month
    else {
      qb.groupBy('month, year');
    }

    return (await qb.getRawMany()).map((row) => new StatHumidityModel(row));
  }

  async last(locationId: string): Promise<Humidity> {
    const location = await this.locationService.getLocationIfExists(locationId);

    return this.humidityRepository.findOne({
      where: { location, createdAt: LessThanOrEqual(new Date()) },
      order: { createdAt: 'DESC' },
    });
  }
}
