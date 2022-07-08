import { Module } from '@nestjs/common';
import { TemperaturesService } from './temperatures.service';
import { TemperaturesController } from './temperatures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsModule } from '../locations/locations.module';
import { Temperature } from './entities/temperature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Temperature]), LocationsModule],
  controllers: [TemperaturesController],
  providers: [TemperaturesService],
})
export class TemperaturesModule {}
