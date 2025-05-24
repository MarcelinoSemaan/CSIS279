import {TypeOrmModule} from "@nestjs/typeorm";
import {Module, forwardRef} from "@nestjs/common";
import {Driver} from "./driver.entity";
import {driverController} from "./driver.controller";
import {driverService} from "./driver.service";
import {Vehicle} from "../vehicle/vehicle.entity";
import {VehicleModule} from "../vehicle/vehicle.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Driver, Vehicle]),
        forwardRef(() => VehicleModule)
    ],
    providers: [driverService],
    controllers: [driverController],
    exports: [driverService]
})

export class DriverModule {
}

