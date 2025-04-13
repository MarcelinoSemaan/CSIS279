import {Column, Entity, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {Vehicle} from "../vehicle/vehicle.entity";
import {Team} from "../team/team.entity";

@Entity()
export class Member {
    @PrimaryColumn()
    memberID: number;

    @OneToOne(() => Vehicle)
    memberVehicleRegNum: number;

    @OneToOne(() => Vehicle)
    vehicleRegNum: number;

    @ManyToOne(() => Team)
    memberTeamID: number;

    @ManyToOne(() => Team)
    memberTeamOfficeID: number;

    @Column()
    memberName: string;

    @Column()
    memberNumber: number;

}