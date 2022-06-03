import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Detail } from '../details/entities/detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Detail])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
