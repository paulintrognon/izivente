import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {} from '../../../../dbschema/edgeql-js'
import { User } from 'dbschema/interfaces'
import { CharsetEnum, randomText } from 'src/helpers/crypto-random-string.helper'
import { EdgedbService, edb } from 'src/shared/edgedb/edgedb.service'

@Injectable()
export class UserRefreshTokenService {
  constructor(
    private readonly edgedb: EdgedbService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Return auth tokens (access + refresh tokens) generated from user's session data
   */
  async generateTokens(
    user: Pick<User, 'id'>
  ): Promise<{ accessToken: string; refreshToken: string }> {
    /**
     * Generate accessToken
     */
    const accessToken = this.jwtService.sign({ userId: user.id })

    /**
     * Generate refreshToken, valid 30 days
     */
    const refreshToken = randomText(64, CharsetEnum.AlphaNumeric)
    const expiryDate = new Date(Date.now() + 30 * 24 * 3600 * 1000)

    /**
     * Insert refreshToken in database
     */
    await this.edgedb.run(
      edb.insert(edb.UserRefreshToken, {
        refreshToken,
        expiryDate,
      })
    )

    return {
      accessToken,
      refreshToken,
    }
  }
}
