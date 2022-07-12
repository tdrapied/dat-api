import { Module } from '@nestjs/common';
import { TemperaturesService } from './temperatures.service';
import { TemperaturesController } from './temperatures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsModule } from '../locations/locations.module';
import { Temperature } from './entities/temperature.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Temperature]),
    LocationsModule,
    AuthModule,
  ],
  controllers: [TemperaturesController],
  providers: [TemperaturesService],
})
export class TemperaturesModule {}
