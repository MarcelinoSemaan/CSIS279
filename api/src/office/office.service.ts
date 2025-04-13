import {Office} from "./office.entity"
import {createOfficeDTO} from "./dto/create-office.dto";
import {updateOfficeDTO} from "./dto/update-office.dto";

import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class officeService {
    constructor(
        @InjectRepository(Office)
        private readonly officeRepository: Repository<Office>
    ) {
    }

    @InjectRepository(Office)
    createOffice(createOfficeDTO: createOfficeDTO): Promise<Office> {
        const office = new Office();
        office.officeID = createOfficeDTO.officeID;
        office.officeBranch = createOfficeDTO.officeBranch;
        office.officePhone = createOfficeDTO.officePhone;

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
}