import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {Office} from "../office/office.entity";

@Entity()
export class Team {
    @PrimaryColumn()
    teamID: number;

    @OneToOne(() => Office)
    @JoinColumn({name : "teamOfficeID"})
    teamOfficeID: number;

    @Column()
    teamName: string;

    @Column()
    teamLeader: string;
}