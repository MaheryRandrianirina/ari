import { IsNotEmpty, IsString } from "class-validator"

export class CreateTaskResponsibleDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;
}