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
    findByID(@Param('memberID', ParseIntPipe) memberID: number): Promise<Member> {
        return this.memberService.findByID(memberID);
    }

    @Get(':id')
    findMemberTeamByTeamID(@Param('memberTeamID', ParseIntPipe) memberTeamID: number): Promise<Team> {
        return this.memberService.findMemberTeamByTeamID(memberTeamID);
    }

    @Get(':id')
    findMemberOfficeByTeamOfficeID(@Param('memberTeamOfficeID', ParseIntPipe) memberTeamOfficeID: number): Promise<Office> {
        return this.memberService.findMemberOfficeByTeamOfficeID(memberTeamOfficeID);
    }

    @Get(':id')
    findMemberVehicleByVehicleRegNum(@Param('memberVehicleRegNum', ParseIntPipe) memberVehicleRegNum: number): Promise<Vehicle> {
        return this.memberService.findMemberVehicleByVehicleRegNum(memberVehicleRegNum);
    }

    @Get(':id')
    findMemberDriverByDriverID(@Param('memberDriverID', ParseIntPipe) memberDriverID: number): Promise<Driver>{
        return this.memberService.findMemberDriverByDriverID(memberDriverID);
    }

    @Put(':id')
    updateMember(@Param('memberID', ParseIntPipe) memberID: number, updateMemberDTO: updateMemberDTO): Promise<Member> {
        return this.memberService.updateMember(memberID, updateMemberDTO);
    }

    @Delete(':id')
    remove(@Param('memberID', ParseIntPipe) memberID: number): Promise<void> {
        return this.memberService.deleteMember(memberID);
    }
}