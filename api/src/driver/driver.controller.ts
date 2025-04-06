import {Controller, Get, Param} from "@nestjs/common";
import {driverService} from "./driver.service";
import { Driver } from "./driver.entity";

@Controller('driver')
export class DriverController {
    constructor(private readonly driverService: driverService) {}

    @Get(':id')
    findByDriverID(@Param('id') id:number):Promise<Driver>{
        return this.driverService.findByDriverID(id);
    }
}
