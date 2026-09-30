import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const accessToken: unknown = request.cookies.accessToken;
          return typeof accessToken === 'string' ? accessToken : null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: { sub: number }) {
    return {
      userId: payload.sub,
    };
  }
}
