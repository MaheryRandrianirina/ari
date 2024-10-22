import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/register/dto/create-user.dto';

@Injectable()
export class AuthService {

    login(userDto: CreateUserDto){
        //
    }
}
