import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn} from "typeorm";
import {Office} from "../office/office.entity";
import {Member} from "../member/member.entity";

@Entity()
export class Team {
    @PrimaryColumn()
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
}

