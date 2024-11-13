import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserGuard } from 'src/user/user.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get()
    @UseGuards(UserGuard)
    async getUsers(@Res() response: Response){
        try {
            const users = await this.usersService.getUsers();
            response.json({success: true, users});
        }catch(e){
            response.status(500).json({
                success: false,
                message: "An error has occured while fetching users",
                error: e
            })
        }
        
    }
}
