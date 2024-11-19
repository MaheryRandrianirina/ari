import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from 'utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class RegisterService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly jwtService: JwtService){}

    async register(userDto: CreateUserDto)
    {
        const existingUser = await this.userModel.findOne({username: userDto.username});
        if(existingUser){
            throw new UnauthorizedException("User with this name already exists");
        }else if(userDto.password !== userDto.password_confirmation){
            throw new NotAcceptableException("Passwords you provided are not the same");
        }
        
        const hashedPassword = await hashPassword(userDto.password);        
        const createdUser = new this.userModel({
            ...userDto, password: hashedPassword, 
            refresh_token: this.jwtService.sign({username: userDto.username, sub: randomBytes(16)}),
            role: ""
        });

        return await createdUser.save();
    }
}
