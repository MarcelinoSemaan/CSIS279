import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {Driver} from "../driver/driver.entity";
import {Member} from "../member/member.entity";

@Entity()
export class Vehicle {
    @PrimaryColumn()
    vehicleRegNum: number;

    @OneToOne(() => Driver, driver => driver.Vehicle)
    @JoinColumn({ name: 'vehicleDriverID'})
    vehicleDriverID: number;

    @OneToOne(() => Member, member => member.memberVehicleRegNum)
    Member: Member;

    @Column()
    vehicleBrand: string;

    @Column()
    vehicleModel: string;

    @Column()
    vehicleType: number;

    @Column()
    vehicleCapacity: number;
}

