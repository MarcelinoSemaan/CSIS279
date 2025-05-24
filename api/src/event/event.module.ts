import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { eventController } from './event.controller';
import { eventService } from './event.service';
import { Team } from '../team/team.entity';
import { Office } from '../office/office.entity';
import { TeamModule } from '../team/team.module';
import { OfficeModule } from '../office/office.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Team, Office]),
    TeamModule,
    OfficeModule
  ],
  controllers: [eventController],
  providers: [eventService],
  exports: [eventService],
})
export class EventModule{}
