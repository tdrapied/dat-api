import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../core/orm/orm.config';
import { DetailsModule } from './details/details.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ScheduleModule.forRoot(),

    // Modules
    DetailsModule,
    LocationsModule,
  ],
})
export class AppModule {}
