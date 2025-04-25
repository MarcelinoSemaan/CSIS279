import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {Team} from "../team/team.entity";

@Entity()
export class Office {
    @PrimaryColumn()
    officeID: number;

    @OneToOne(() => Team)
    Team:Team;

    @Column()
    officeBranch: string;

    @Column()
    officePhone: number;
}