import { Event, EventStatus } from "./event.entity";
import { createEventDTO } from "./dto/create-event.dto";
import { updateEventDTO } from "./dto/update-event.dto";
import { Team } from "../team/team.entity";
import { Office } from "../office/office.entity";
import { teamService } from "../team/team.service";
import { officeService } from "../office/office.service";

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class eventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private readonly teamService: teamService,
        private readonly officeService: officeService
    ) {
    }

    async createEvent(createEventDTO: createEventDTO, loggedInOfficeId: number): Promise<Event> {
        const event = new Event();

        // Set basic event properties
        event.eventName = createEventDTO.eventName;
        event.eventType = createEventDTO.eventType;
        event.eventDescription = createEventDTO.eventDescription;
        event.eventStartDate = createEventDTO.eventStartDate;
        event.eventEndDate = createEventDTO.eventEndDate;
        event.status = createEventDTO.status || EventStatus.ACTIVE;

        // Set office and team related fields
        event.eventOfficeID = loggedInOfficeId;
        event.eventTeamID = createEventDTO.eventTeamID;

        // Fetch team details for office ID
        if (createEventDTO.eventTeamID) {
            let team: Team | null = null;
            try {
                team = await this.teamService.findByTeamID(createEventDTO.eventTeamID);
            } catch (err) {
                console.error(`Error fetching team with ID ${createEventDTO.eventTeamID}:`, err);
                throw new BadRequestException(`Error fetching team details.`);
            }

            if (team) {
                event.eventTeamOfficeID = team.teamOfficeID || loggedInOfficeId;
            }
        }

        // Save and return the event
        return this.eventRepository.save(event);
    }

    async findAll(): Promise<Event[]> {
        return this.eventRepository.find();
    }

    async findByEventID(eventID: number): Promise<Event> {
        return this.eventRepository.findOneBy({ eventID: eventID });
    }

    async findEventOffice(eventOfficeID: number): Promise<Office> {
        return this.officeService.findByOfficeID(eventOfficeID);
    }

    async findEventTeam(eventTeamID: number): Promise<Team> {
        return this.teamService.findByTeamID(eventTeamID);
    }

    async findEventsByTeam(teamID: number): Promise<Event[]> {
        return this.eventRepository.findBy({ eventTeamID: teamID });
    }

    async findEventsByOffice(officeID: number): Promise<Event[]> {
        return this.eventRepository.findBy({ eventOfficeID: officeID });
    }

    async findEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
        return this.eventRepository.createQueryBuilder("event")
            .where("event.eventStartDate >= :startDate", { startDate })
            .andWhere("event.eventEndDate <= :endDate", { endDate })
            .getMany();
    }

    async findEventsByProblemType(problemType: number): Promise<Event[]> {
        return this.eventRepository.findBy({ eventProblemType: problemType });
    }

    async updateEvent(eventID: number, updateEventDTO: updateEventDTO): Promise<Event> {
        const event = await this.findByEventID(eventID);
        if (!event) {
            throw new NotFoundException("Event not found");
        }

        // Update basic event properties
        if (updateEventDTO.eventName) event.eventName = updateEventDTO.eventName;
        if (updateEventDTO.eventType) event.eventType = updateEventDTO.eventType;
        if (updateEventDTO.eventDescription !== undefined) event.eventDescription = updateEventDTO.eventDescription;
        if (updateEventDTO.eventStartDate) event.eventStartDate = updateEventDTO.eventStartDate;
        if (updateEventDTO.eventEndDate) event.eventEndDate = updateEventDTO.eventEndDate;
        if (updateEventDTO.status) event.status = updateEventDTO.status;

        // Update team related fields
        if (updateEventDTO.eventTeamID) {
            event.eventTeamID = updateEventDTO.eventTeamID;
            const team = await this.teamService.findByTeamID(updateEventDTO.eventTeamID);
            if (team) {
                event.eventTeamOfficeID = team.teamOfficeID;
            }
        }

        return this.eventRepository.save(event);
    }

    async reportProblem(eventId: number, problemDescription: string, problemType: number): Promise<Event> {
        const event = await this.findByEventID(eventId);
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

        event.eventProblemType = problemType;
        event.eventProblemDescription = problemDescription;

        return this.eventRepository.save(event);
    }

    async finishEvent(eventID: number): Promise<Event> {
        const event = await this.eventRepository.findOneBy({ eventID: eventID });
        if (!event) {
            throw new NotFoundException("Event not found");
        }

        event.status = EventStatus.FINISHED;
        return this.eventRepository.save(event);
    }

    async removeEvent(eventID: number): Promise<void> {
        // Find the event first to make sure it exists
        const event = await this.eventRepository.findOneBy({ eventID: eventID });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventID} not found`);
        }

        // Delete the event using the repository's delete method with an object specifying the ID field
        await this.eventRepository.delete({ eventID });
    }
}
