import {Team} from "./team.entity"
import {teamService} from "./team.service"
import {teamController} from "./team.controller";
import {OfficeModule} from "../office/office.module";
import {Office} from "../office/office.entity";

import {TypeOrmModule} from "@nestjs/typeorm";
import {Module, forwardRef} from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forFeature([Team, Office]),
        forwardRef(() => OfficeModule)  // Using forwardRef to handle potential circular dependency
    ],
    providers: [teamService],
    controllers: [teamController],
    exports: [teamService]
})

export class TeamModule {
}

