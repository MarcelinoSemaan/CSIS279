import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {Team} from "../team/team.entity";

@Entity()
export class Office {
    @PrimaryColumn()
    officeID: number;

    @OneToOne(() => Team, team => team.teamOfficeID)
    Team: Team;

    @Column()
    officeBranch: string;

    @Column()
    officePhone: number;

    @Column()
    officeEmail: string;

    @Column()
    password: string;
}

