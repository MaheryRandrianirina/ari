import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { Observable } from 'rxjs';

export type JWTDecoded = {sub: ObjectId, username: string};

export interface CustomRequest extends Request {
  user?:JWTDecoded
}

@Injectable()
export class UserGuard implements CanActivate {
  
  constructor(private readonly jwtService: JwtService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    if(request.headers["authorization"] === undefined){
      throw new UnauthorizedException("You are not authorised to access this resource.");
    }
    
    const token = request.headers.authorization;
    try {
      const verified = this.jwtService.verify(token);
      if(verified){
        request.user = this.jwtService.decode(token);

        return true;
      }

      return false;
    }catch(e){
      throw new UnauthorizedException("Token has expired");
    }  
  }
}
