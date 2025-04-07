import {createDriverDTO} from "./create-driver.dto";
import {PartialType} from "@nestjs/mapped-types";

export class updateDriverDTO extends PartialType(createDriverDTO) {
}