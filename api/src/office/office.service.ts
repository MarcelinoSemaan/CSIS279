import {Office} from "./office.entity"
import {createOfficeDTO} from "./dto/create-office.dto";
import {updateOfficeDTO} from "./dto/update-office.dto";
import {Team} from "../team/team.entity";

import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class officeService {
    constructor(
        @InjectRepository(Office)
        private readonly officeRepository: Repository<Office>,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>
    ) {
    }

    async createOffice(createOfficeDTO: createOfficeDTO): Promise<Office> {
        const office = new Office();
        office.officeID = createOfficeDTO.officeID;
        office.officeBranch = createOfficeDTO.officeBranch;
        office.officePhone = createOfficeDTO.officePhone;
        office.officeEmail = createOfficeDTO.officeEmail;

        // Hash the password before saving
        const salt = await bcrypt.genSalt();
        office.password = await bcrypt.hash(createOfficeDTO.password, salt);

        return this.officeRepository.save(office);
    }

    async findAll(): Promise<Office[]> {
        return this.officeRepository.find();
    }

    async findByOfficeID(officeID: number): Promise<Office> {
        return this.officeRepository.findOneBy({officeID: officeID});
    }

    async updateOffice(officeID: number, updateOfficeDTO: updateOfficeDTO): Promise<Office> {
        const office = await this.officeRepository.findOneBy({officeID: officeID});
        if (!office) {
            throw new NotFoundException("office not found");
        }
        Object.assign(office, updateOfficeDTO);
        return this.officeRepository.save(office);
    }

    async deleteOffice(officeID: number): Promise<void> {
        await this.officeRepository.delete(officeID);
    }

    async findOfficeTeam(officeID: number): Promise<Team> {
        const team = await this.teamRepository.findOne({
            where: {teamOfficeID: officeID}
        });

        if (!team) {
            throw new NotFoundException(`Team for office with ID ${officeID} not found`);
        }

        return team;
    }

    async findByEmail(email: string): Promise<Office> {
        const office = await this.officeRepository.findOneBy({officeEmail: email});
        if (!office) {
            throw new NotFoundException(`Office with email ${email} not found`);
        }
        return office;
    }
}
