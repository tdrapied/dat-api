import { Module } from '@nestjs/common';
import { HumiditiesService } from './humidities.service';
import { HumiditiesController } from './humidities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Humidity } from './entities/humidity.entity';
import { LocationsModule } from '../locations/locations.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Humidity]), LocationsModule, AuthModule],
  controllers: [HumiditiesController],
  providers: [HumiditiesService],
})
export class HumiditiesModule {}
