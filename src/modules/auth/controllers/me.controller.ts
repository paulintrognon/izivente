import { Controller, Get, Req, UseGuards } from '@nestjs/common'

import { JwtGuard } from '../jwt/jwt.guard'
import { RequestWithUserSession } from '../types/RequestContainingUser'

@Controller()
export class MeAuthController {
  @Get('/auth/me')
  @UseGuards(JwtGuard)
  me(@Req() req: RequestWithUserSession) {
    return { user: req.user }
  }
}
