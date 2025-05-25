import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Office} from "../office/office.entity";
import {Member} from "../member/member.entity";

export enum TeamStatus {
    AVAILABLE = "available",
    UNAVAILABLE = "unavailable"
}

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    teamID: number;

    @OneToOne(() => Office, office => office.Team)
    @JoinColumn({name : "teamOfficeID"})
    teamOfficeID: number;

    @OneToMany(() => Member, member => member.memberTeamID)
    Member: Member[];

    @Column()
    teamName: string;

    @Column()
    teamLeader: string;

    @Column({
        type: "enum",
        enum: TeamStatus,
        default: TeamStatus.AVAILABLE
    })
    teamStatus: TeamStatus;
}
