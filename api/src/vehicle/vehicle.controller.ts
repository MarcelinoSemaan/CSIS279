import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import {vehicleService} from "./vehicle.service";
import {Vehicle} from "./vehicle.entity"
import {createVehicleDTO} from "./dto/create-vehicle.dto";
import {updateVehicleDTO} from "./dto/update-vehicle.dto";
import {Driver} from "../driver/driver.entity";

@Controller('vehicle')
export class vehicleController {
    constructor(private readonly vehicleService: vehicleService) {
    }

    @Post()
    create(@Body() createVehicleDTO: createVehicleDTO) {
        return this.vehicleService.createVehicle(createVehicleDTO);
    }

    @Get()
    findAll(): Promise<Vehicle[]> {
        return this.vehicleService.findAll();
    }

    @Get(':id')
    findByVehicleRegNum(@Param('id', ParseIntPipe) vehicleRegNum: number): Promise<Vehicle> {
        return this.vehicleService.findByVehicleRegNum(vehicleRegNum);
    }

    @Get(':id/driver')
    findVehicleDriver(@Param('id', ParseIntPipe) vehicleRegNum: number): Promise<Driver> {
        return this.vehicleService.findVehDriverByDriverID(vehicleRegNum);
    }

    @Get('type/:type')
    findByVehicleType(@Param('type', ParseIntPipe) vehicleType: number): Promise<Vehicle[]> {
        return this.vehicleService.findByVehicleType(vehicleType);
    }

    @Put(':id')
    updateVehicle(
        @Param('id', ParseIntPipe) vehicleRegNum: number,
        @Body() updateVehicleDTO: updateVehicleDTO
    ): Promise<Vehicle> {
        return this.vehicleService.updateVehicle(vehicleRegNum, updateVehicleDTO);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) vehicleRegNum: number): Promise<void> {
        return this.vehicleService.removeVehicle(vehicleRegNum);
    }
}

