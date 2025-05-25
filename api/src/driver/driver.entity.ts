import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {Vehicle} from "../vehicle/vehicle.entity";

@Entity()
export class Driver {
    @PrimaryColumn()
    driverID: number;

    @OneToOne(() => Vehicle, vehicle => vehicle.driver, { nullable: true })
    vehicle: Vehicle;

    @Column()
    driverName: string;

    @Column()
    driverNumber: number;

    @Column()
    driverRegion: string;
}

