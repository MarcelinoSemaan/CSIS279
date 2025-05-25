import {Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, Not} from "typeorm";

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
        vehicle.vehicleBrand = createVehicleDTO.vehicleBrand;
        vehicle.vehicleModel = createVehicleDTO.vehicleModel;
        vehicle.vehicleType = createVehicleDTO.vehicleType;
        vehicle.vehicleCapacity = createVehicleDTO.vehicleCapacity;

        vehicle.vehicleDriverID = createVehicleDTO.vehicleDriverID;
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
        const vehicleToUpdate = await this.vehicleRepository.findOneBy({ vehicleRegNum });
        if (!vehicleToUpdate) {
            throw new NotFoundException(`Vehicle with registration number ${vehicleRegNum} not found`);
        }

        // If vehicleDriverID is being updated, perform additional checks.
        if (updateVehicleDTO.vehicleDriverID !== undefined &&
            updateVehicleDTO.vehicleDriverID !== null &&
            updateVehicleDTO.vehicleDriverID !== vehicleToUpdate.vehicleDriverID) { // Check only if driver ID is actually changing

            const newDriverId = updateVehicleDTO.vehicleDriverID;

            // Check if the new driver ID is valid (driver exists)
            try {
                const driver = await this.driverService.findByDriverID(newDriverId);
                if (!driver) {
                    throw new BadRequestException(`Driver with ID ${newDriverId} not found or is invalid. Cannot assign to vehicle.`);
                }

                // Check if the driver is already assigned to another vehicle
                const existingVehicleWithDriver = await this.vehicleRepository.findOneBy({
                    vehicleDriverID: newDriverId
                });

                // If the driver is already assigned to another vehicle, we need to clear that assignment first
                if (existingVehicleWithDriver && existingVehicleWithDriver.vehicleRegNum !== vehicleRegNum) {
                    console.log(`Driver ${newDriverId} is already assigned to vehicle ${existingVehicleWithDriver.vehicleRegNum}. Removing that assignment first.`);

                    // Clear the driver assignment from the other vehicle
                    existingVehicleWithDriver.vehicleDriverID = null;
                    await this.vehicleRepository.save(existingVehicleWithDriver);
                }
            } catch (e) {
                if (e instanceof BadRequestException) {
                    throw e;
                } else {
                    console.error(`Error checking driver existence for ID ${newDriverId}:`, e);
                    throw new InternalServerErrorException(`An error occurred while verifying driver ID ${newDriverId}.`);
                }
            }
        }

        // Apply updates to the vehicle object
        Object.assign(vehicleToUpdate, updateVehicleDTO);

        // Now, try to save the updated vehicle
        try {
            return await this.vehicleRepository.save(vehicleToUpdate);
        } catch (dbError) {
            console.error(`Error saving vehicle ${vehicleRegNum} during update:`, dbError);
            // Handle database errors
            if (dbError.code === 'ER_DUP_ENTRY' || dbError.code === '23505') {
                throw new ConflictException(`Failed to update vehicle. A unique constraint was violated. You can try again to automatically reassign the driver.`);
            }
            if (dbError.code === 'ER_NO_REFERENCED_ROW_2' || dbError.code === '23503') {
                throw new BadRequestException(`Failed to update vehicle. The specified driver ID (${vehicleToUpdate.vehicleDriverID}) may be invalid.`);
            }
            throw new InternalServerErrorException('An unexpected error occurred while saving the vehicle update.');
        }
    }

    async removeVehicle(vehicleRegNum: number): Promise<void> {
        await this.vehicleRepository.delete(vehicleRegNum);
    }
}

