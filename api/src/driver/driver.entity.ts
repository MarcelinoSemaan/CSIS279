import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Driver {
    @PrimaryColumn()
    driverID: number;

    @Column()
    driverName: string;

    @Column()
    driverNumber: number;

    @Column()
    driverRegion: string;
}