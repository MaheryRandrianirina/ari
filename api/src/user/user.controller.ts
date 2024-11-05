import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from './user.guard';
import { Request as Req, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get()
    @UseGuards(UserGuard)
    async get(@Request() req: Req)
    {
        return await this.userService.get(req);
    }

    @Get('/token')
    @UseGuards(AuthGuard)
    async getToken(@Request() req: Req, @Res() res: Response)
    {
        const bearerToken = await this.userService.getToken(req);

        res.json({
            success: true,
            bearer_token: bearerToken
        });
    }
}
