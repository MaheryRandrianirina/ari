import { Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request as Req } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/register/schemas/user.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly jwtService: JwtService){}

    async get(@Request() req: Req)
    {
        const access_token = req.headers['authorization'];
        const decodedToken = this.jwtService.decode(access_token);
        
        const user = await this.userModel.findOne({_id: decodedToken.sub}, {password: 0, refresh_token:0});
        return user;
    }

    async getToken(@Request() req: Req)
    {
        const refresh_token = req.cookies['__token'];
        const decodedToken = this.jwtService.decode(refresh_token);
        const user = await this.userModel.findOne({username: decodedToken.username});

        return await this.jwtService.signAsync({username: user.username, sub: user._id});
    }
}
