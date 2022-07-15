import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationsService } from '../locations/locations.service';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Temperature, TemperatureType } from './entities/temperature.entity';
import { SearchAirTemperatureDto } from './dto/search-air-temperature.dto';
import { StatTemperatureModel } from './models/stat-temperature.model';

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

  async findAllAir(
    locationId: string,
    searchAirTemperatureDto: SearchAirTemperatureDto,
  ): Promise<StatTemperatureModel[]> {
    if (
      searchAirTemperatureDto.from > new Date() ||
      searchAirTemperatureDto.to > new Date() ||
      searchAirTemperatureDto.from >= searchAirTemperatureDto.to
    ) {
      throw new BadRequestException('Invalid date range');
    }

    const location = await this.locationService.getLocationIfExists(locationId);

    // Set global query parameters
    const qb = this.temperatureRepository
      .createQueryBuilder('t')
      .select([
        'MIN(t.value) as min',
        'AVG(t.value) as mean',
        'MAX(t.value) as max',
        'MIN(t.createdAt) as from',
        'MAX(t.createdAt) as to',
        'EXTRACT(MONTH FROM t.createdAt) as month',
        'EXTRACT(YEAR FROM t.createdAt) as year',
      ])
      .where({
        location,
        type: TemperatureType.AIR,
      })
      .andWhere('t.createdAt BETWEEN :from AND :to', {
        from: searchAirTemperatureDto.from,
        to: searchAirTemperatureDto.to,
      })
      .orderBy('year, month');

    // If the difference is less than 1 day, we want to group by 5 minutes
    if (
      searchAirTemperatureDto.to <
      new Date(searchAirTemperatureDto.from.getTime() + 3600 * 1000 * 24)
    ) {
      qb.addSelect([
        'EXTRACT(HOUR FROM t.createdAt) as hour',
        'EXTRACT(DAY FROM t.createdAt) as day',
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
      searchAirTemperatureDto.to <=
      new Date(searchAirTemperatureDto.from.getTime() + 3600 * 1000 * 24 * 7)
    ) {
      qb.addSelect([
        'EXTRACT(HOUR FROM t.createdAt) as hour',
        'EXTRACT(day FROM t.createdAt) as day',
      ]);

      qb.groupBy('hour, day, month, year');
      qb.addOrderBy('year, month, day, hour', 'ASC');
    }
    // Else if the difference is less than or equal to 90 days, we want to group by day
    else if (
      searchAirTemperatureDto.to <=
      new Date(searchAirTemperatureDto.from.getTime() + 3600 * 1000 * 24 * 90)
    ) {
      qb.addSelect(['EXTRACT(day FROM t.createdAt) as day']);

      qb.groupBy('day, month, year');
      qb.addOrderBy('year, month, day', 'ASC');
    }
    // Else if the difference is less than or equal to 365 days, we want to group by month
    else if (
      searchAirTemperatureDto.to <=
      new Date(searchAirTemperatureDto.from.getTime() + 3600 * 1000 * 24 * 365)
    ) {
      qb.addSelect(['EXTRACT(WEEK FROM t.createdAt) as week']);

      qb.groupBy('week, month, year');
      qb.addOrderBy('year, month, week', 'ASC');
    }
    // Else we want to group by month
    else {
      qb.groupBy('month, year');
    }

    return (await qb.getRawMany()).map((row) => new StatTemperatureModel(row));
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
