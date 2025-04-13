import {createTeamDTO} from "./create-team.dto";
import {PartialType} from "@nestjs/mapped-types";

export class updateTeamDTO extends PartialType(createTeamDTO){}