import { Test, TestingModule } from '@nestjs/testing';
import { TemperaturesService } from './temperatures.service';
import { AppModule } from '../../app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Temperature, TemperatureType } from './entities/temperature.entity';
import { LocationsModule } from '../locations/locations.module';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

describe('TemperaturesService', () => {
  let module: TestingModule;
  let temperaturesService: TemperaturesService;
  let temperaturesRepository: Repository<Temperature>;

  beforeAll(async () => {
    jest.setTimeout(90 * 1000);

    module = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([Temperature]),
        LocationsModule,
      ],
      providers: [TemperaturesService],
    }).compile();

    temperaturesService = module.get<TemperaturesService>(TemperaturesService);
    temperaturesRepository = module.get<Repository<Temperature>>(
      getRepositoryToken(Temperature),
    );

    // Generate fake temperatures
    await generateAllTemperature();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(temperaturesService).toBeDefined();
    expect(temperaturesRepository).toBeDefined();
  });

  /********************************************
   * Other methods
   * ******************************************/

  const generateAllTemperature = async () => {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    );

    // TODO: Generate random temperatures to old months

    // Generate daytime temperatures
    let lastTemperature = null;
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const firstDate = new Date(today.getFullYear(), today.getMonth(), i);
      lastTemperature = await generateDaytimeTemperature(
        firstDate,
        14,
        28,
        lastTemperature,
      );
    }
  };

  const generateDaytimeTemperature = async (
    firstDate: Date,
    minTemperature: number,
    maxTemperature: number,
    lastTemperature: number = null,
  ): Promise<number> => {
    const lastTime = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate(),
      23,
      59,
    );

    // Get the datetime of the temperature peak
    const maxPeakDate = getMaxPeakDate(firstDate);

    // Get random max, min morning and night temperatures
    const randomMaxTemperature = getRandomTemperature(
      maxTemperature - 3,
      maxTemperature,
    );
    const morningTemperature =
      lastTemperature ??
      getRandomTemperature(minTemperature, minTemperature + 3);
    const nightTemperature = getRandomTemperature(
      minTemperature,
      minTemperature + 3,
    );

    // ...
    const morningInterval = (randomMaxTemperature - morningTemperature) * 2;
    const nightInterval = (randomMaxTemperature - nightTemperature) * 2;

    // All peaks
    const peaks = [
      ...generatePeaksArray(firstDate, maxPeakDate, morningInterval),
      maxPeakDate,
      ...generatePeaksArray(maxPeakDate, lastTime, nightInterval),
    ];

    const rows: Temperature[] = [];
    const currentDate = new Date(firstDate);
    if (!lastTemperature) lastTemperature = morningTemperature;
    while (currentDate.getTime() <= lastTime.getTime()) {
      // If current date is a peak
      const currentDateIsPeak = peaks.find(
        (date) => date.getTime() === currentDate.getTime(),
      );
      if (currentDateIsPeak) {
        if (currentDate.getTime() < maxPeakDate.getTime()) {
          lastTemperature = lastTemperature + 0.5;
        } else {
          lastTemperature = lastTemperature - 0.5;
        }
      }

      // Generate temperature row
      rows.push({
        id: randomUUID(),
        value: lastTemperature,
        type: TemperatureType.AIR,
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
    await temperaturesRepository.save(rows);

    // Return last temperature
    return lastTemperature;
  };

  const getMaxPeakDate = (date: Date): Date => {
    const min = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
    );
    const max = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      16,
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
