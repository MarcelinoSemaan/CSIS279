import { EventStatus } from "../event.entity";
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class createEventDTO {
    @IsNumber()
    @IsOptional()
    eventOfficeID?: number;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    eventTeamID: number;

    @IsNumber()
    @IsOptional()
    eventTeamOfficeID?: number;

    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsString()
    @IsOptional()
    eventDescription?: string;

    @IsDate()
    @Type(() => Date)
    eventStartDate: Date;

    @IsDate()
    @Type(() => Date)
    eventEndDate: Date;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    eventProblemType?: number;

    @IsString()
    @IsOptional()
    eventProblemDescription?: string;

    @IsOptional()
    status?: EventStatus;
}
