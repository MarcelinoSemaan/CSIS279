import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {Office} from "../office/office.entity";

@Entity()
export class Team {
    @PrimaryColumn()
    teamID: number;

    @OneToOne(() => Office)
    teamOfficeID: number;

    @Column()
    teamName: string;

    @Column()
    teamLeader: string;
}