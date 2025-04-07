import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

import {createDriverDTO} from "./dto/create-driver.dto";
import {Driver} from "./driver.entity";


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

}