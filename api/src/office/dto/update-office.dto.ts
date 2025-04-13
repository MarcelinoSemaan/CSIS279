import {createOfficeDTO} from "./create-office.dto";
import {PartialType} from "@nestjs/mapped-types";

export class updateOfficeDTO extends PartialType(createOfficeDTO) {}