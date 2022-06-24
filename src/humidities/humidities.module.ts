import { Module } from '@nestjs/common';
import { HumiditiesService } from './humidities.service';
import { HumiditiesController } from './humidities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Humidity } from './entities/humidity.entity';
import { Location } from '../locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Humidity, Location])],
  controllers: [HumiditiesController],
  providers: [HumiditiesService],
})
export class HumiditiesModule {}
