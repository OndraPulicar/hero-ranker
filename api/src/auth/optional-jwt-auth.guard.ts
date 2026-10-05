import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken: unknown = request.cookies?.accessToken;

    if (typeof accessToken !== 'string' || !accessToken) {
      return true;
    }

    return super.canActivate(context);
  }
}
