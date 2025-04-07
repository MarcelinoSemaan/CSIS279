import {createVehicleDTO} from "./create-vehicle.dto";
import {PartialType} from "@nestjs/mapped-types";

export class updateVehicleDTO extends PartialType(createVehicleDTO) {
}