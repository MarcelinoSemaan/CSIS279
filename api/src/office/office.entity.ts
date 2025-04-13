import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Office {
    @PrimaryColumn()
    officeID: number;

    @Column()
    officeBranch: string;

    @Column()
    officePhone: number;
}