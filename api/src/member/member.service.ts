import {Member} from "./member.entity";
import {createMemberDTO} from "./dto/create-member.dto";
import {updateMemberDTO} from "./dto/update-member.dto";

import {Vehicle} from "../vehicle/vehicle.entity";
import {vehicleService} from "../vehicle/vehicle.service";

import {Team} from "../team/team.entity";
import {teamService} from "../team/team.service";

import {Office} from "../office/office.entity";
import {officeService} from "../office/office.service";

import {Driver} from "../driver/driver.entity";
import {driverService} from "../driver/driver.service";

import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class memberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        private readonly teamService: teamService,
        private readonly officeService: officeService,
        private readonly vehicleService: vehicleService,
        private readonly driverService: driverService,
    ) {
    }

    @InjectRepository(Vehicle)
    @InjectRepository(Team)
    createMember(createMemberDTO: createMemberDTO): Promise<Member> {
        const member = new Member();
        member.memberID = createMemberDTO.memberID;
        member.memberVehicleRegNum = createMemberDTO.memberVehicleRegNum;
        member.memberDriverID = createMemberDTO.memberDriverID;
        member.memberTeamID = createMemberDTO.memberTeamID;
        member.memberTeamOfficeID = createMemberDTO.memberTeamOfficeID;
        member.memberName = createMemberDTO.memberName;
        member.memberNumber = createMemberDTO.memberNumber;

        return this.memberRepository.save(member);
    }

    async findAll(): Promise<Member[]> {
        return await this.memberRepository.find();
    }

    async findByID(memberID: number): Promise<Member> {
        return await this.memberRepository.findOneBy({memberID: memberID});
    }

    async findMemberTeamByTeamID(memberTeamID: number): Promise<Team> {
        return await this.teamService.findByTeamID(memberTeamID);
    }

    async findMemberOfficeByTeamOfficeID(memberTeamOfficeID: number): Promise<Office> {
        return await this.officeService.findByOfficeID(memberTeamOfficeID);
    }

    async findMemberVehicleByVehicleRegNum(memberVehicleRegNum: number): Promise<Vehicle> {
        return await this.vehicleService.findByVehicleRegNum(memberVehicleRegNum);
    }

    async findMemberDriverByDriverID(memberDriverID: number): Promise<Driver> {
        return await this.driverService.findByDriverID(memberDriverID);
    }

    async updateMember(memberID: number, updateMemberDTO: updateMemberDTO): Promise<Member> {
        const member = await this.memberRepository.findOneBy({memberID: memberID});
        if (!member) {
            throw new NotFoundException("Member not found");
        }
        Object.assign(member, updateMemberDTO);
        return this.memberRepository.save(member);
    }

    async deleteMember(memberID: number): Promise<void>{
        await this.memberRepository.delete(memberID);
    }
}