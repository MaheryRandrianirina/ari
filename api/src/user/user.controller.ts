import { Body, ConflictException, Controller, Delete, Get, Param, Put, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from './user.guard';
import { Request as Req, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from 'src/register/dto/update-user.dto';

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

    @Put("/:username/check")
    @UseGuards(UserGuard)
    async check(@Param() params:{username: string}, @Body() updateDTO:UpdateUserDto, @Res() res: Response)
    {
        if(params.username !== updateDTO.username){
            throw new ConflictException({success: false, message: "url argument doesn't match the data provided"})
        }

        await this.userService.check(updateDTO.username)

        res.json({
            success: true,
            message: "User has been checked"
        });
    }

    @Delete("/:username/delete")
    @UseGuards(UserGuard)
    async delete(@Param() params: {username:string}, @Res() res: Response){
        await this.userService.delete(params.username)

        res.json({
            success: true,
            message: "User has been deleted"
        });
    }
}
