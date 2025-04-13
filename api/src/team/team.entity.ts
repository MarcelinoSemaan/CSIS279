import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Team {
    @PrimaryColumn()
    teamID: number;

    @Column()
    teamOfficeID: number;

    @Column()
    teamName: string;

    @Column()
    teamLeader: string;
}