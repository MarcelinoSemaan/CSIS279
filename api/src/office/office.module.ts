import {Office} from "./office.entity";
import {officeController} from "./office.controller";
import {officeService} from "./office.service";

import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Office])],
    providers: [officeService],
    controllers: [officeController],
})

export class OfficeModule {
}