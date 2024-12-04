import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/register/schemas/user.schema';
import { CustomRequest } from 'src/user/user.guard';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    
    const user = await this.userModel.findOne({_id:request.user?.sub});
    if(user.role !== "admin"){
      throw new UnauthorizedException();
    }

    return true;
  }
}
