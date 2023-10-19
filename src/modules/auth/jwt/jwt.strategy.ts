import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EdgedbService, edb } from 'src/modules/shared/edgedb/edgedb.service'

import { AccessTokenPayload } from './AccessTokenPayload.type'
import { JWT_SECRET } from './jwt.const'
import { UserSession } from '../types/UserSession.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly edgedb: EdgedbService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    })
  }

  /**
   * Retrieve user session data from a JWT payload
   */
  async validate(payload: AccessTokenPayload): Promise<UserSession> {
    const user = await this.edgedb.run(
      edb.select(edb.User, () => ({
        filter_single: { id: payload.userId },

        id: true,
        email: true,
      }))
    )

    if (!user) {
      throw new UnauthorizedException(`ACCESS_TOKEN_USER_NOT_FOUND ${payload.userId}`)
    }

    return {
      id: user.id,
      email: user.email,
    }
  }
}
