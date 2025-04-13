import {Office} from "./office.entity";
import {createOfficeDTO} from "./dto/create-office.dto";
import {updateOfficeDTO} from "./dto/update-office.dto";
import {officeService} from "./office.service";

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
    findByOfficeID(@Param('officeID', ParseIntPipe) officeID: number): Promise<Office> {
        return this.officeService.findByOfficeID(officeID);
    }

    @Put(':id')
    updateOffice(@Param('officeID', ParseIntPipe) officeID: number, updateOfficeDTO:updateOfficeDTO): Promise<Office> {
        return this.officeService.updateOffice(officeID, updateOfficeDTO);
    }

    @Delete(':id')
    remove(@Param('officeID', ParseIntPipe) officeID: number): Promise<void> {
        return this.officeService.deleteOffice(officeID);
    }
}