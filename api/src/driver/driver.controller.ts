import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import {driverService} from "./driver.service";
import {Driver} from "./driver.entity";
import {createDriverDTO} from "./dto/create-driver.dto";
import {updateDriverDTO} from "./dto/update-driver.dto";

@Controller('driver')
export class driverController {
    constructor(private readonly driverService: driverService) {
    }

    @Post()
    create(@Body() createDriverDTO: createDriverDTO) {
        return this.driverService.createDriver(createDriverDTO);
    }

    @Get()
    findAll(): Promise<Driver[]> {
        return this.driverService.findAll();
    }

    @Get(':id')
    findByDriverID(@Param('driverID', ParseIntPipe) driverID: number): Promise<Driver> {
        return this.driverService.findByDriverID(driverID);
    }

    @Get(':id')
    findByDriverReg(@Param('driverRegion') driverRegion: string): Promise<Driver[]> {
        return this.driverService.findByDriverReg(driverRegion);
    }

    @Put(':id')
    update(
        @Param('driverID', ParseIntPipe) driverID: number,
        @Body() updateDriverDTO: updateDriverDTO
    ): Promise<Driver> {
        return this.driverService.updateDriver(driverID, updateDriverDTO);
    }

    @Delete(':id')
    remove(@Param('driverID', ParseIntPipe) driverID: number): Promise<void> {
        return this.driverService.deleteDriver(driverID);
    }
}
