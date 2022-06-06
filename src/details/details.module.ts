import { Module } from '@nestjs/common';
import { DetailsService } from './details.service';
import { DetailsController } from './details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detail } from './entities/detail.entity';
import { Location } from '../locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Detail, Location])],
  controllers: [DetailsController],
  providers: [DetailsService],
})
export class DetailsModule {}
