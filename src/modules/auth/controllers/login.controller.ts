import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { EdgedbService, edb } from 'src/modules/shared/edgedb/edgedb.service'

import { compareHash } from '../helpers/hash.helper'
import { UserRefreshTokenService } from '../services/UserRefreshToken.service'

class LoginAuthControllerRequest {
  email!: string
  password!: string
}

@Controller()
export class LoginAuthController {
  constructor(
    private readonly edgedb: EdgedbService,
    private readonly userRefreshTokenService: UserRefreshTokenService
  ) {}

  @Post('/auth/login')
  async login(@Body() body: LoginAuthControllerRequest) {
    /**
     * Retrieve user from database
     */
    const user = await this.edgedb.run(
      edb.select(edb.User, () => ({
        filter_single: { email: body.email },

        id: true,
        email: true,
        passwordHash: true,
      }))
    )

    /**
     * User not found: 401
     */
    if (!user) {
      throw new UnauthorizedException()
    }

    /**
     * Check given password
     */
    if (!compareHash(body.password, user.passwordHash)) {
      throw new UnauthorizedException()
    }

    /**
     * User is valid: generate tokens
     */
    const { accessToken, refreshToken } = await this.userRefreshTokenService.generateTokens(user)

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }
}
