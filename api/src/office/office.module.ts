import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './office.entity';
import { officeService } from './office.service';
import { officeController } from './office.controller';
import { Team } from '../team/team.entity';
import { TeamModule } from '../team/team.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Office, Team]),
        forwardRef(() => TeamModule)
    ],
    providers: [officeService],
    controllers: [officeController],
    exports: [officeService]
})
export class OfficeModule {}
