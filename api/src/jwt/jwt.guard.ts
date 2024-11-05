import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if(request.headers["authorization"] === undefined || !isJWT(request.headers["authorization"])){
      throw new UnauthorizedException("You are not authorised to access this resource.");
    }

    return true;
  }
}
