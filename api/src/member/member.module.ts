import {Member} from "./member.entity"
import {memberService} from "./member.service";
import {memberController} from "./member.controller";
import {TeamModule} from "../team/team.module";
import {VehicleModule} from "../vehicle/vehicle.module";
import {OfficeModule} from "../office/office.module"; // Added OfficeModule import
import {DriverModule} from "../driver/driver.module"; // Added DriverModule import
import {Team} from "../team/team.entity";
import {Vehicle} from "../vehicle/vehicle.entity";
import {Office} from "../office/office.entity"; // Added Office entity import
import {Driver} from "../driver/driver.entity"; // Added Driver entity import

import {TypeOrmModule} from "@nestjs/typeorm";
import {Module, forwardRef} from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([Member, Team, Vehicle, Office, Driver]), // Added Office and Driver entities
        forwardRef(() => TeamModule),
        forwardRef(() => VehicleModule),
        forwardRef(() => OfficeModule), // Added OfficeModule with forwardRef
        forwardRef(() => DriverModule)  // Added DriverModule with forwardRef
    ],
    providers: [memberService],
    controllers: [memberController],
    exports: [memberService]
})

export class MemberModule {

}

