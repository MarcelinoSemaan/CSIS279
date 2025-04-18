import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {createVehicleDTO} from "./dto/create-vehicle.dto";
import {updateVehicleDTO} from "./dto/update-vehicle.dto"
import {Vehicle} from "./vehicle.entity";
import {Driver} from "../driver/driver.entity"
import {driverService} from "../driver/driver.service"


@Injectable()
export class vehicleService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
        private readonly driverService: driverService
    ) {
    }

    @InjectRepository(Driver)
    createVehicle(createVehicleDTO: createVehicleDTO): Promise<Vehicle> {
        const vehicle = new Vehicle();
        vehicle.vehicleRegNum = createVehicleDTO.vehicleRegNum;
        vehicle.vehicleDriverID = createVehicleDTO.vehicleDriverID;
        vehicle.vehicleBrand = createVehicleDTO.vehicleBrand;
        vehicle.vehicleModel = createVehicleDTO.vehicleModel;
        vehicle.vehicleType = createVehicleDTO.vehicleType;
        vehicle.vehicleCapacity = createVehicleDTO.vehicleCapacity;

        return this.vehicleRepository.save(vehicle);
    }

    async findAll(): Promise<Vehicle[]> {
        return this.vehicleRepository.find();
    }

    async findByVehicleRegNum(vehicleRegNum: number): Promise<Vehicle> {
        return this.vehicleRepository.findOneBy({vehicleRegNum: vehicleRegNum});
    }


    async findVehDriverByDriverID(vehicleDriverID: number): Promise<Driver> {
        return this.driverService.findByDriverID(vehicleDriverID);
    }

    async findByVehicleType(vehicleType: number): Promise<Vehicle[]> {
        return this.vehicleRepository.findBy({vehicleType: vehicleType});
    }

    async updateVehicle(vehicleRegNum: number, updateVehicleDTO: updateVehicleDTO): Promise<Vehicle> {
        const vehicle = await this.vehicleRepository.findOneBy({vehicleRegNum});
        if (!vehicle) {
            throw new NotFoundException("Vehicle not found");
        }
        Object.assign(vehicle, updateVehicleDTO);
        return this.vehicleRepository.save(vehicle);
    }

    async removeVehicle(vehicleRegNum: number): Promise<void> {
        await this.vehicleRepository.delete(vehicleRegNum);
    }
}

