import { IsJWT, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password_confirmation: string
}