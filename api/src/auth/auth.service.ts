import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/register/dto/create-user.dto';
import { User } from 'src/register/schemas/user.schema';
import { comparePasswords } from 'utils/bcrypt';
import { UserDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>, 
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}
    
    async login(userDto: CreateUserDto|UserDto){
        const user = await this.userModel.findOne({username: userDto.username});
        
        const isVerified = await comparePasswords(userDto.password, user.password);
        if(!isVerified){
            throw new UnauthorizedException("The credentials you provided are incorrects.");
        }
        
        try {
            this.jwtService.verify(user.refresh_token);

            return {
                refresh_token: user.refresh_token,
                access_token: await this.jwtService.signAsync({sub: user._id, username: user.username})
            }
        }catch(e) {
            // create a new instance of JwtService to create different token
            const jwtServiceInstance =  new JwtService({
                secret: this.configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: "60s"},
              });
            const refresh_token = jwtServiceInstance.sign({sub: user._id, username: user.username});
            await this.userModel.updateOne({_id:user._id}, {refresh_token:refresh_token});
            
            return {
                refresh_token: refresh_token,
                access_token: await this.jwtService.signAsync({sub: user._id, username: user.username})
            }
        }
        
    }
}
