import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    task: string

    @IsString()
    @IsNotEmpty()
    status?: string

    @IsNumber()
    @IsOptional()
    progress?: number
}