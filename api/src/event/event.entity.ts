import {Entity, PrimaryColumn, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Team } from "../team/team.entity";
import { Office } from "../office/office.entity";

export enum EventStatus {
    ACTIVE = "active",
    FINISHED = "finished",
}

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    eventID: number;

    @Column({ nullable: true })
    eventOfficeID: number;

    @Column()
    eventTeamID: number;

    @Column({ nullable: true })
    eventTeamOfficeID: number;

    @Column()
    eventName: string;

    @Column()
    eventStartDate: Date;

    @Column()
    eventEndDate: Date;

    @Column({ nullable: true })
    eventDescription: string;

    @Column({ default: 0 })
    eventProblemType: number;

    @Column({ nullable: true })
    eventProblemDescription: string;

    @Column({
        type: "enum",
        enum: EventStatus,
        default: EventStatus.ACTIVE
    })
    status: EventStatus;

    @ManyToOne(() => Team, { eager: true })
    @JoinColumn({ name: 'eventTeamID' })
    team: Team;

    @ManyToOne(() => Office, { eager: true })
    @JoinColumn({ name: 'eventOfficeID' })
    office: Office;
}

