import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import {driverService} from "./driver.service";
import {Driver} from "./driver.entity";
import {createDriverDTO} from "./dto/create-driver.dto";
import {updateDriverDTO} from "./dto/update-driver.dto";
import {Vehicle} from "../vehicle/vehicle.entity";

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
    findByDriverID(@Param('id', ParseIntPipe) driverID: number): Promise<Driver> {
        return this.driverService.findByDriverID(driverID);
    }

    @Get(':id/vehicle')
    findDriverVehicle(@Param('id', ParseIntPipe) driverID: number): Promise<Vehicle> {
        return this.driverService.findDriverVehicle(driverID);
    }

    @Get('region/:region')
    findByDriverReg(@Param('region') driverRegion: string): Promise<Driver[]> {
        return this.driverService.findByDriverReg(driverRegion);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) driverID: number,
        @Body() updateDriverDTO: updateDriverDTO
    ): Promise<Driver> {
        return this.driverService.updateDriver(driverID, updateDriverDTO);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) driverID: number): Promise<void> {
        return this.driverService.deleteDriver(driverID);
    }
}
