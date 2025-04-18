import {Member} from "./member.entity"
import {memberService} from "./member.service";
import {memberController} from "./member.controller";

import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Member])],
    providers: [memberService],
    controllers: [memberController]
})

export class MemberModule {

}