import {Team} from "./team.entity"
import {teamService} from "./team.service"
import {teamController} from "./team.controller";

import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Team])],
    providers: [teamService],
    controllers: [teamController],
})

export class TeamModule {
}