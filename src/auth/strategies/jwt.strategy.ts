import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey:
        '3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username }
  }
}
