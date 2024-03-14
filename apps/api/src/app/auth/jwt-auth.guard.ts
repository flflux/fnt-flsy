import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../core/consts/env.consts';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('jwt auth guard implemneted')
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromRequest(request);
    console.log(token)

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      request.user = decoded;
      console.log(request.user)
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractJwtFromRequest(request): string {
    if (!request.headers.authorization) {
      return null;
    }
    const parts = request.headers.authorization.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}
