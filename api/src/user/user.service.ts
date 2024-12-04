import { Injectable, NotImplementedException, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request as Req } from 'express';
import { Model, Types } from 'mongoose';
import { User } from 'src/register/schemas/user.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly jwtService: JwtService){}

    async get(user_id:string) {
        return this.userModel.findOne({_id: new Types.ObjectId(user_id)}, {password:0, role:0});
    }

    async getAuthUser(@Request() req: Req)
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

    async check(username: string)
    {
        try {
            const check = await this.userModel.updateOne({username:username}, {$set:{role: "user"}});
            if(!check.acknowledged){
                throw new NotImplementedException("There was problem while updating user role");
            }

            return true;
        }catch(e){
            throw e;
        }
    }

    async delete(username:string)
    {
        try {
            const deleteUser = await this.userModel.deleteOne({username:username});
            if(!deleteUser.acknowledged){
                throw new NotImplementedException("There was problem while deleting user");
            }

            return true;
        }catch(e){
            throw e;
        }
    }

    async getTaskResponsible(responsibleid:Types.ObjectId) {
        return await this.userModel.find({_id: responsibleid});
    }
}
