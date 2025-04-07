import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {Driver} from "../driver/driver.entity";

@Entity()
export class Vehicle {
    @PrimaryColumn()
    vehicleRegNum: number;

    @OneToOne(() => Driver)
    driverDriverID: number;

    @Column()
    vehicleBrand: string;

    @Column()
    vehicleModel: string;

    @Column()
    vehicleType: number;

    @Column()
    vehicleCapacity: number;
}