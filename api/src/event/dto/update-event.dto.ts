import { PartialType } from "@nestjs/mapped-types";
import { createEventDTO } from "./create-event.dto";

export class updateEventDTO extends PartialType(createEventDTO) {
    // All fields are inherited from createEventDTO and made optional
    // This ensures all properties from createEventDTO are available but optional for updates
}
