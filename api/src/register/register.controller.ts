import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('')
export class RegisterController {

    constructor(private readonly registerService: RegisterService)
    {}

    @Post("/register")
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response)
    {
        try {
            const registeredUser = await this.registerService.register(createUserDto);
            
            
            
            res.status(200).json({
                success: true,
                message: "You've been successfully registered"
            });
        }catch(e){
            res.status(400).json({
                success: false,
                message: "Your registration has failed. Please try again."
            });
        }
    }
}
