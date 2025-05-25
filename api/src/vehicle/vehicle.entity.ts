import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {Driver} from "../driver/driver.entity";
import {Member} from "../member/member.entity";

@Entity()
export class Vehicle {
    @PrimaryColumn()
    vehicleRegNum: number;

    @Column({ nullable: true })
    vehicleDriverID: number;

    @OneToOne(() => Driver)
    @JoinColumn({ name: 'vehicleDriverID' })
    driver: Driver;

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

