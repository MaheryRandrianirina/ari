import { PartialType } from "@nestjs/mapped-types"
import { CreateTaskResponsibleDto } from "./create-task-responsible.dto";

export class UpdateTaskResponsibleDto extends PartialType(CreateTaskResponsibleDto) {
    
}