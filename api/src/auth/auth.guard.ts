import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Used to check if user has refresh_token but not necessary logged in
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request= context.switchToHttp().getRequest();
    
    if(request.cookies['__token'] === undefined){
      throw new UnauthorizedException("Your are not authorized to access this resource");
    }

    return true;
  }
}
