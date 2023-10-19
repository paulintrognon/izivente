import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { LoginAuthController } from './controllers/login.controller'
import { MeAuthController } from './controllers/me.controller'
import { RegisterAuthController } from './controllers/register.controller'
import { JWT_SECRET } from './jwt/jwt.const'
import { JwtStrategy } from './jwt/jwt.strategy'
import { UserRefreshTokenService } from './services/UserRefreshToken.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '20h' },
    }),
  ],
  providers: [UserRefreshTokenService, JwtStrategy],
  controllers: [RegisterAuthController, LoginAuthController, MeAuthController],
})
export class AuthModule {}
