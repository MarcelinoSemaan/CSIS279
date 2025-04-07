import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {Driver} from "./driver.entity";
import {driverController} from "./driver.controller";
import {driverService} from "./driver.service";

@Module({
    imports: [TypeOrmModule.forFeature([Driver])],
    providers: [driverService],
    controllers: [driverController],
})

export class DriverModule {}