import {Vehicle} from "./vehicle.entity";
import {vehicleController} from "./vehicle.controller";
import {vehicleService} from "./vehicle.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module, forwardRef} from "@nestjs/common";
import {DriverModule} from "../driver/driver.module";
import {Driver} from "../driver/driver.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Vehicle, Driver]),
        forwardRef(() => DriverModule)
    ],
    providers: [vehicleService],
    controllers: [vehicleController],
    exports: [vehicleService]
})

export class VehicleModule {
}

