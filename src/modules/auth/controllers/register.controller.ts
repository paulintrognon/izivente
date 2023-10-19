import { Body, Controller, Post } from '@nestjs/common'
import { EdgedbService, edb } from 'src/modules/shared/edgedb/edgedb.service'

import { hashSecret } from '../helpers/hash.helper'
import { UserRefreshTokenService } from '../services/UserRefreshToken.service'

class RegisterAuthControllerRequest {
  email!: string
  password!: string
}

@Controller()
export class RegisterAuthController {
  constructor(
    private readonly edgedb: EdgedbService,
    private readonly userRefreshTokenService: UserRefreshTokenService
  ) {}

  @Post('/auth/register')
  async login(@Body() body: RegisterAuthControllerRequest) {
    /**
     * Insert user
     */
    const passwordHash = await hashSecret(body.password)
    const user = await this.edgedb.run(
      edb.select(
        edb.insert(edb.User, {
          email: body.email,
          passwordHash,
        }),
        () => ({
          id: true,
          email: true,
        })
      )
    )

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
