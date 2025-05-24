import {Member} from "./member.entity";
import {memberService} from "./member.service";
import {createMemberDTO} from "./dto/create-member.dto";
import {updateMemberDTO} from "./dto/update-member.dto";

import {Team} from "../team/team.entity";
import {Office} from "../office/office.entity";
import {Vehicle} from "../vehicle/vehicle.entity";
import {Driver} from "../driver/driver.entity";

import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";

@Controller('member')
export class memberController {
    constructor(private readonly memberService: memberService) {
    }

    @Post()
    create(@Body() createMemberDTO: createMemberDTO) {
        return this.memberService.createMember(createMemberDTO);
    }

    @Get()
    findAll(): Promise<Member[]> {
        return this.memberService.findAll();
    }

    @Get(':id')
    findByID(@Param('id', ParseIntPipe) memberID: number): Promise<Member> {
        return this.memberService.findByID(memberID);
    }

    @Get(':id/team')
    findMemberTeam(@Param('id', ParseIntPipe) memberID: number): Promise<Team> {
        return this.memberService.findMemberTeamByTeamID(memberID);
    }

    @Get(':id/office')
    findMemberOffice(@Param('id', ParseIntPipe) memberID: number): Promise<Office> {
        return this.memberService.findMemberOfficeByTeamOfficeID(memberID);
    }

    @Get(':id/vehicle')
    findMemberVehicle(@Param('id', ParseIntPipe) memberID: number): Promise<Vehicle> {
        return this.memberService.findMemberVehicleByVehicleRegNum(memberID);
    }

    @Get(':id/driver')
    findMemberDriver(@Param('id', ParseIntPipe) memberID: number): Promise<Driver>{
        return this.memberService.findMemberDriverByDriverID(memberID);
    }

    @Put(':id')
    updateMember(@Param('id', ParseIntPipe) memberID: number, @Body() updateMemberDTO: updateMemberDTO): Promise<Member> {
        return this.memberService.updateMember(memberID, updateMemberDTO);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) memberID: number): Promise<void> {
        return this.memberService.deleteMember(memberID);
    }
}

