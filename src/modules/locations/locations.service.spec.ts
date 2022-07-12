import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { AppModule } from '../../app.module';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

const location1: Location = {
  id: '6ef36c45-1385-4978-9dd0-4fa7f8a0d551',
  name: 'Domaine de Lille',
};

const location2: Location = {
  id: 'c0c91533-5872-4094-b5a8-5df4827e1539',
  name: 'Domaine de Strasbourg',
};

const location3: Location = {
  id: '4892c48d-79fe-4ca0-9f8a-449f9f251524',
  name: 'Domaine Jean Sipp',
};

describe('LocationsService', () => {
  let module: TestingModule;
  let locationsService: LocationsService;
  let locationsRepository: Repository<Location>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Location, User])],
      providers: [LocationsService],
    }).compile();

    locationsService = module.get<LocationsService>(LocationsService);
    locationsRepository = module.get<Repository<Location>>(
      getRepositoryToken(Location),
    );

    // Generate fake locations
    await locationsRepository.save(location1);
    await locationsRepository.save(location2);
    await locationsRepository.save(location3);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(locationsService).toBeDefined();
    expect(locationsRepository).toBeDefined();
  });
});
