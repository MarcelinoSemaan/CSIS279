import {Repository} from "typeorm";
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

import {createDriverDTO} from "./dto/create-driver.dto";
import {Driver} from "./driver.entity";
import {updateDriverDTO} from "./dto/update-driver.dto";


@Injectable()
export class driverService {
    constructor(
        @InjectRepository(Driver)
        private readonly driverRepository: Repository<Driver>,
    ) {
    }

    createDriver(createDriverDTO: createDriverDTO): Promise<Driver> {
        const driver = new Driver();
        driver.driverID = createDriverDTO.driverID;
        driver.driverName = createDriverDTO.driverName;
        driver.driverNumber = createDriverDTO.driverNumber;
        driver.driverRegion = createDriverDTO.driverRegion;

        return this.driverRepository.save(driver);
    }

    async findAll(): Promise<Driver[]> {
        return this.driverRepository.find();
    }

    async findByDriverID(driverID: number): Promise<Driver> {
        return this.driverRepository.findOneBy({driverID: driverID});
    }

    async findByDriverReg(driverRegion: string): Promise<Driver[]> {
        return this.driverRepository.findBy({driverRegion: driverRegion});
    }

    async updateDriver(driverID: number, updateDriverDTO: updateDriverDTO): Promise<Driver> {
        const driver = await this.findByDriverID(driverID);
        if (!driver) {
            throw new NotFoundException("driver not found");
        }
        Object.assign(driver, updateDriverDTO);
        return this.driverRepository.save(driver);
    }

    async deleteDriver(driverID: number): Promise<void> {
        await this.driverRepository.delete(driverID);
    }
}