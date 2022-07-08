import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../core/orm/orm.config';
import { HumiditiesModule } from './modules/humidities/humidities.module';
import { LocationsModule } from './modules/locations/locations.module';
import { UsersModule } from './modules/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfig } from '../core/mailer/mailer.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ScheduleModule.forRoot(),
    MailerModule.forRoot(MailerConfig.getConfig()),

    // Modules
    UsersModule,
    HumiditiesModule,
    LocationsModule,
    AuthModule,
  ],
})
export class AppModule {}
