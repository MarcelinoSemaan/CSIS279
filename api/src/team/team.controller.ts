import {Team} from "./team.entity"
import {teamService} from "./team.service";
import {createTeamDTO} from "./dto/create-team.dto";
import {updateTeamDTO} from "./dto/update-team.dto";

import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post} from "@nestjs/common";
import {Office} from "../office/office.entity";

@Controller('team')
export class teamController {
    constructor(private readonly teamService: teamService) {
    }

    @Post()
    create(@Body() createTeamDTO: createTeamDTO){
        return this.teamService.createTeam(createTeamDTO);
    }

    @Get()
    findAll(): Promise<Team[]>{
        return this.teamService.findAll();
    }

    @Get(':id')
    findByTeamID(@Param('teamID', ParseIntPipe) teamID: number): Promise<Team> {
        return this.teamService.findByTeamID(teamID);
    }

    @Get(':id')
    findTeamOfficeByOfficeID(@Param('teamOfficeID', ParseIntPipe) teamOfficeID: number): Promise<Office> {
        return this.teamService.findTeamOfficeByOfficeID(teamOfficeID);
    }

    @Post(':id')
    updateTeam(
        @Param('teamID', ParseIntPipe) teamID: number,
        @Body() updateTeamDTO: updateTeamDTO
    ):Promise<Team> {
        return this.teamService.updateTeam(teamID, updateTeamDTO);
    }

    @Delete(':id')
    remove(@Param('teamID', ParseIntPipe) teamID: number): Promise<void> {
        return this.teamService.removeTeam(teamID);
    }
}