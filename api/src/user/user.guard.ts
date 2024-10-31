import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  
  constructor(private readonly jwtService: JwtService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if(request.headers["authorization"] === undefined){
      throw new UnauthorizedException("You are not authorised to access this resource.");
    }
    
    const token = request.headers.authorization;
    try {
      const verified = this.jwtService.verify(token);
      if(verified){
        return true;
      }

      return false;
    }catch(e){
      throw new UnauthorizedException(JSON.stringify({
        message: "Token has expired"
      }));
    }  
  }
}
