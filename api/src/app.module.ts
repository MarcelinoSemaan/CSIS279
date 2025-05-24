import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {OfficeModule} from "./office/office.module";
import {TeamModule} from "./team/team.module";
import {DriverModule} from "./driver/driver.module";
import {VehicleModule} from "./vehicle/vehicle.module";
import {MemberModule} from "./member/member.module";
import {EventModule} from "./event/event.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        OfficeModule,
        TeamModule,
        DriverModule,
        VehicleModule,
        MemberModule,
        EventModule
    ],
})
export class AppModule {
}

