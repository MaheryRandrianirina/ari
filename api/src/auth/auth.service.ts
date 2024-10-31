import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/register/dto/create-user.dto';
import { User } from 'src/register/schemas/user.schema';
import { comparePasswords } from 'utils/bcrypt';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly jwtService: JwtService){}
    
    async login(userDto: CreateUserDto){
        const user = await this.userModel.findOne({username: userDto.username});
        
        const isVerified = await comparePasswords(userDto.password, user.password);
        if(!isVerified){
            throw new UnauthorizedException("The credentials you provided are incorrects.");
        }
        
        return {
            access_token: await this.jwtService.signAsync({sub: user._id, username: user.username})
        }
    }
}
