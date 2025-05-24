import {Office} from "./office.entity";
import {createOfficeDTO} from "./dto/create-office.dto";
import {updateOfficeDTO} from "./dto/update-office.dto";
import {officeService} from "./office.service";
import {Team} from "../team/team.entity";

import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";

@Controller('office')
export class officeController {
    constructor(private officeService: officeService) {
    }

    @Post()
    create(@Body() createOfficeDTO: createOfficeDTO) {
        return this.officeService.createOffice(createOfficeDTO);
    }

    @Get()
    findAll(): Promise<Office[]> {
        return this.officeService.findAll();
    }

    @Get(':id')
    findByOfficeID(@Param('id', ParseIntPipe) id: number): Promise<Office> {
        return this.officeService.findByOfficeID(id);
    }

    @Get(':id/team')
    findOfficeTeam(@Param('id', ParseIntPipe) id: number): Promise<Team> {
        return this.officeService.findOfficeTeam(id);
    }

    @Put(':id')
    updateOffice(@Param('id', ParseIntPipe) id: number, @Body() updateOfficeDTO:updateOfficeDTO): Promise<Office> {
        return this.officeService.updateOffice(id, updateOfficeDTO);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.officeService.deleteOffice(id);
    }
}

