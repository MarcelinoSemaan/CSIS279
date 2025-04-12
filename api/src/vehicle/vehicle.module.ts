import {Vehicle} from "./vehicle.entity";
import {vehicleController} from "./vehicle.controller";
import {vehicleService} from "./vehicle.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Vehicle])],
    providers: [vehicleService],
    controllers: [vehicleController],
})

export class VehicleModule {
}