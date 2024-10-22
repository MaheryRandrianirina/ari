import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from 'utils/bcrypt';

@Injectable()
export class RegisterService {

    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async register(userDto: CreateUserDto)
    {
        const hashedPassword = await hashPassword(userDto.password);
        const createdUser = new this.userModel({...userDto, password: hashedPassword});
        return await createdUser.save();
    }
}
