import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {Vehicle} from "../vehicle/vehicle.entity";

@Entity()
export class Driver {
    @PrimaryColumn()
    driverID: number;

    @OneToOne(() => Vehicle, () => Driver)
    Vehicle: Vehicle;

    @Column()
    driverName: string;

    @Column()
    driverNumber: number;

    @Column()
    driverRegion: string;
}