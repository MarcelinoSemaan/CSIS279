import { Event } from "./event.entity";
import { createEventDTO } from "./dto/create-event.dto";
import { updateEventDTO } from "./dto/update-event.dto";
import { eventService } from "./event.service";
import { Team } from "../team/team.entity";
import { Office } from "../office/office.entity";

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards, UnauthorizedException, Patch } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller('event')
@UseGuards(AuthGuard('jwt'))
export class eventController {
    constructor(private eventService: eventService) {
    }

    @Post()
    create(@Body() createEventDTO: createEventDTO, @Request() req) {
        console.log('Create event request:', { body: createEventDTO, user: req.user });

        // Check if req.user exists
        if (!req.user) {
            console.error('No user found in request. Authentication may have failed.');
            throw new UnauthorizedException('User not authenticated');
        }

        // Remove eventOfficeID and eventID from the DTO if present
        if ('eventOfficeID' in createEventDTO) {
            delete createEventDTO.eventOfficeID;
        }
        if ('eventID' in createEventDTO) {
            delete createEventDTO.eventID;
        }

        const officeId = req.user.officeId;
        console.log('Using office ID for event:', officeId);

        return this.eventService.createEvent(createEventDTO, officeId);
    }

    @Get()
    findAll(): Promise<Event[]> {
        return this.eventService.findAll();
    }

    @Get(':id')
    findByEventID(@Param('id', ParseIntPipe) eventID: number): Promise<Event> {
        return this.eventService.findByEventID(eventID);
    }

    @Get(':id/office')
    findEventOffice(@Param('id', ParseIntPipe) eventID: number): Promise<Office> {
        return this.eventService.findEventOffice(eventID);
    }

    @Get(':id/team')
    findEventTeam(@Param('id', ParseIntPipe) eventID: number): Promise<Team> {
        return this.eventService.findEventTeam(eventID);
    }

    @Get('team/:teamID')
    findEventsByTeam(@Param('teamID', ParseIntPipe) teamID: number): Promise<Event[]> {
        return this.eventService.findEventsByTeam(teamID);
    }

    @Get('office/:officeID')
    findEventsByOffice(@Param('officeID', ParseIntPipe) officeID: number): Promise<Event[]> {
        return this.eventService.findEventsByOffice(officeID);
    }

    @Get('filter/date-range')
    findEventsByDateRange(
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date
    ): Promise<Event[]> {
        return this.eventService.findEventsByDateRange(startDate, endDate);
    }

    @Get('filter/problem-type/:type')
    findEventsByProblemType(@Param('type', ParseIntPipe) problemType: number): Promise<Event[]> {
        return this.eventService.findEventsByProblemType(problemType);
    }

    @Put(':id')
    updateEvent(@Param('id', ParseIntPipe) eventID: number, @Body() updateEventDTO: updateEventDTO): Promise<Event> {
        return this.eventService.updateEvent(eventID, updateEventDTO);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) eventID: number): Promise<void> {
        return this.eventService.removeEvent(eventID);
    }

    @Post(':id/report')
    async reportProblem(
        @Param('id', ParseIntPipe) id: number,
        @Body() reportData: { problemType: number; problemDescription: string }
    ): Promise<Event> {
        return this.eventService.reportProblem(
            id,
            reportData.problemDescription,
            reportData.problemType
        );
    }

    private getProblemTypeFromPriority(priority: string): number {
        switch (priority.toLowerCase()) {
            case 'low': return 1;
            case 'medium': return 2;
            case 'high': return 3;
            case 'critical': return 4;
            default: return 1;
        }
    }
}
