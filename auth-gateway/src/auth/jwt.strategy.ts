// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import constants from './constants';

// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: constants.jwtSecret,
//     });
//   }

//   async validate(payload) {
//     return { id: payload.sub, user: payload.user };
//   }
// }

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import constants from './constants';
import { Request } from 'express';

const cookieExtractor = (req: Request) => {
  console.log(req)
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: constants.jwtSecret,
    });
  }

  async validate(payload) {
    return { id: payload.sub, user: payload.user };
  }
}
