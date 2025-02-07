import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}