import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UserDto } from './dto/user.dto';
import { UserService } from 'src/user/user.service';
import { UserGuard } from 'src/user/user.guard';

@Controller('')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly userService: UserService){}

    @Post("/login")
    async login(@Body() userDto: UserDto, @Res() res: Response){
        const jwtObject = await this.authService.login(userDto);
        
        res.cookie("__token", jwtObject.refresh_token,{httpOnly: true, secure: true, sameSite: "none", maxAge: 60*3600*1000});
        
        res.json({
            success: true,
            message: "You've been successfully logged in",
            bearer_token: jwtObject.access_token
        });
    }

    @Get("/auth/user")
    @UseGuards(UserGuard)
    async getAuthUser(@Req() req: Request)
    {
        return await this.userService.getAuthUser(req);
    }
}
