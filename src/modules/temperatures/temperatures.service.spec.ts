import { Test, TestingModule } from '@nestjs/testing';
import { TemperaturesService } from './temperatures.service';
import { AppModule } from '../../app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Temperature, TemperatureType } from './entities/temperature.entity';
import { LocationsModule } from '../locations/locations.module';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Humidity } from '../humidities/entities/humidity.entity';

describe('TemperaturesService', () => {
  let module: TestingModule;
  let temperaturesService: TemperaturesService;
  let temperaturesRepository: Repository<Temperature>;
  let humiditiesRepository: Repository<Humidity>;

  jest.setTimeout(999999);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([Temperature, Humidity]),
        LocationsModule,
      ],
      providers: [TemperaturesService],
    }).compile();

    temperaturesService = module.get<TemperaturesService>(TemperaturesService);
    temperaturesRepository = module.get<Repository<Temperature>>(
      getRepositoryToken(Temperature),
    );
    humiditiesRepository = module.get<Repository<Humidity>>(
      getRepositoryToken(Humidity),
    );

    // Get the first day of the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);

    // Get today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate fake temperatures
    await generateTemperatures(
      lastMonth,
      today, // date included
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(temperaturesService).toBeDefined();
    expect(temperaturesRepository).toBeDefined();
    expect(humiditiesRepository).toBeDefined();
  });

  /********************************************
   * Other methods
   * ******************************************/

  const generateTemperatures = async (
    startDate: Date,
    endDate: Date = new Date(),
  ) => {
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); // set to midnight

    // Generate temperatures
    let lastTemperature = null;
    while (currentDate <= endDate) {
      lastTemperature = await generateDaytimeTemperature(
        currentDate,
        14,
        28,
        lastTemperature,
      );

      // Add 1 day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const generateDaytimeTemperature = async (
    date: Date,
    minTemperature: number,
    maxTemperature: number,
    lastTemperature: number = null,
  ): Promise<number> => {
    const lastTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
    );

    // Get the datetime of the temperature peak
    const maxPeakDate = getMaxPeakDate(date);

    // Get start datetime of the temperature peak
    const minStartPeakDate = new Date(maxPeakDate);
    minStartPeakDate.setHours(minStartPeakDate.getHours() - 1);
    const startPeakDate = getRandomDate(minStartPeakDate, maxPeakDate, 80);

    // Get end datetime of the temperature peak
    const maxEndPeakDate = new Date(maxPeakDate);
    maxEndPeakDate.setHours(maxEndPeakDate.getHours() + 1);
    const endPeakDate = getRandomDate(maxPeakDate, maxEndPeakDate, 80);

    // Get random max, min morning and night temperatures
    const randomMaxTemperature = getRandomTemperature(
      maxTemperature - 4,
      maxTemperature,
    );
    const morningTemperature =
      lastTemperature ??
      getRandomTemperature(minTemperature, minTemperature + 3);
    const nightTemperature = getRandomTemperature(
      minTemperature,
      minTemperature + 4,
    );

    // ...
    const morningInterval = (randomMaxTemperature - morningTemperature) * 2;
    const nightInterval = (randomMaxTemperature - nightTemperature) * 2;

    // All peaks
    const peaks = [
      ...generatePeaksArray(date, startPeakDate, morningInterval),
      startPeakDate,
      ...generatePeaksArray(endPeakDate, lastTime, nightInterval),
    ];

    const temperaturesRow: Temperature[] = [];
    const humiditiesRow: Humidity[] = [];
    const currentDate = new Date(date);
    if (!lastTemperature) lastTemperature = morningTemperature;
    while (currentDate.getTime() <= lastTime.getTime()) {
      // If current date is a peak
      const currentDateIsPeak = peaks.find(
        (date) => date.getTime() === currentDate.getTime(),
      );
      if (currentDateIsPeak) {
        if (currentDate.getTime() <= startPeakDate.getTime()) {
          lastTemperature = lastTemperature + 0.5;
        } else {
          lastTemperature = lastTemperature - 0.5;
        }
      }

      // Generate temperature row
      temperaturesRow.push({
        id: randomUUID(),
        value: lastTemperature,
        type: TemperatureType.AIR,
        location: {
          id: '6ef36c45-1385-4978-9dd0-4fa7f8a0d551',
          name: 'Domaine de Lille',
        },
        createdAt: new Date(currentDate),
      });

      // Generate humidity row
      humiditiesRow.push({
        id: randomUUID(),
        value: lastTemperature * 2, // Multiply by 2 the temperature to simulate humidity
        location: {
          id: '6ef36c45-1385-4978-9dd0-4fa7f8a0d551',
          name: 'Domaine de Lille',
        },
        createdAt: new Date(currentDate),
      });

      // Add 1 minute
      currentDate.setMinutes(currentDate.getMinutes() + 1);
    }

    // Save all rows
    await temperaturesRepository.save(temperaturesRow);
    await humiditiesRepository.save(humiditiesRow);

    // Return last temperature
    return lastTemperature;
  };

  const getMaxPeakDate = (date: Date): Date => {
    const min = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      13, // 13 hours
    );
    const max = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      16, // 16 hours
    );
    return getRandomDate(min, max);
  };

  const generatePeaksArray = (
    startTime: Date,
    endTime: Date,
    nbInterval: number,
  ): Date[] => {
    const peaksArray: Date[] = [];
    let currentDate = new Date(startTime);
    for (let i = 1; i < nbInterval; i++) {
      const peak = getRandomDate(currentDate, endTime, 35);
      peaksArray.push(peak);
      currentDate = peak;
    }
    return peaksArray;
  };

  const getRandomTemperature = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const getRandomDate = (
    startTime: Date,
    endTime: Date,
    percentage: number = null,
  ): Date => {
    if (percentage !== null) {
      const diff = endTime.getTime() - startTime.getTime();
      endTime = new Date(startTime.getTime() + diff * (percentage / 100));
    }
    const date = new Date(
      startTime.getTime() +
        Math.random() * (endTime.getTime() - startTime.getTime()),
    );
    date.setSeconds(0, 0);
    return date;
  };
});
