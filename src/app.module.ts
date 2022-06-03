import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../core/orm/orm.config';
import { DetailsModule } from './details/details.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ScheduleModule.forRoot(),

    // Modules
    DetailsModule,
  ],
})
export class AppModule {}
