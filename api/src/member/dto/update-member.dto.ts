import {PartialType} from "@nestjs/mapped-types";
import {createMemberDTO} from "./create-member.dto";

export class updateMemberDTO extends PartialType(createMemberDTO) {
}