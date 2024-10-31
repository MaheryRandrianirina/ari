import { Body, Controller, HttpException, NotAcceptableException, Post, Res, UnauthorizedException } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('')
export class RegisterController {

    constructor(private readonly registerService: RegisterService, private readonly authService: AuthService)
    {}

    @Post("/register")
    async register(@Body() createUserDto: CreateUserDto, @Res({passthrough: true}) res: Response)
    {
        try {
            const user = await this.registerService.register(createUserDto);
           
            const jwtObject = await this.authService.login(createUserDto);
            
            res.cookie("__token", user.refresh_token,{httpOnly: true, secure: true, sameSite: "none"});
            
            res.json({
                success: true,
                message: "You've been successfully registered",
                bearer_token: jwtObject.access_token
            });
        }catch(e){
            throw new HttpException(JSON.stringify({
                success: false,
                message: e instanceof NotAcceptableException || e instanceof UnauthorizedException ? e.message : "Your registration has failed. Please try again."
            }), e.getStatus());
        }
    }
}
