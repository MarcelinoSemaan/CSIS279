import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {Vehicle} from "../vehicle/vehicle.entity";
import {Team} from "../team/team.entity";

@Entity()
export class Member {
    @PrimaryColumn()
    memberID: number;

    @OneToOne(() => Vehicle, vehicle => vehicle.Member)
    @JoinColumn({ name: 'memberVehicleRegNum'})
    memberVehicleRegNum: number;

    @OneToOne(() => Vehicle)
    @JoinColumn({name: 'memberDriverID'})
    memberDriverID: number;

    @ManyToOne(() => Team, team => team.Member)
    @JoinColumn({name: 'memberTeamID'})
    memberTeamID: number;

    @ManyToOne(() => Team)
    @JoinColumn({name: 'memberTeamOfficeID'})
    memberTeamOfficeID: number;

    @Column()
    memberName: string;

    @Column()
    memberNumber: number;
}

