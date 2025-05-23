import {Office} from "../office/office.entity";
import {officeService} from "../office/office.service";
import {Team, TeamStatus} from "./team.entity";
import {createTeamDTO} from "./dto/create-team.dto";
import {updateTeamDTO} from "./dto/update-team.dto";
import {Inject, Injectable, NotFoundException, forwardRef} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class teamService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        @Inject(forwardRef(() => officeService))
        private readonly officeService: officeService
    ) {}

    createTeam(createTeamDTO: createTeamDTO): Promise<Team> {
        const team = new Team();
        team.teamID = createTeamDTO.teamID;
        team.teamOfficeID = createTeamDTO.teamOfficeID;
        team.teamName = createTeamDTO.teamName;
        team.teamLeader = createTeamDTO.teamLeader;
        team.teamStatus = TeamStatus.AVAILABLE; // Set default status

        return this.teamRepository.save(team);
    }

    async findAll(): Promise<Team[]> {
        return this.teamRepository.find();
    }

    async findByTeamID(teamID: number): Promise<Team> {
        const team = await this.teamRepository.findOneBy({teamID: teamID});
        if (!team) {
            throw new NotFoundException("Team not found");
        }
        return team;
    }

    async findTeamOfficeByOfficeID(teamOfficeID: number): Promise<Office> {
        return this.officeService.findByOfficeID(teamOfficeID);
    }

    async updateTeam(teamID: number, updateTeamDTO: updateTeamDTO): Promise<Team> {
        const team = await this.teamRepository.findOneBy({teamID: teamID});
        if (!team) {
            throw new NotFoundException("Team not found");
        }
        Object.assign(team, updateTeamDTO);
        return this.teamRepository.save(team);
    }

    async updateTeamStatus(teamID: number, status: TeamStatus): Promise<Team> {
        const team = await this.findByTeamID(teamID);
        team.teamStatus = status;
        return this.teamRepository.save(team);
    }

    async removeTeam(teamID: number): Promise<void> {
        const team = await this.findByTeamID(teamID);
        await this.teamRepository.delete(teamID);
    }
}

