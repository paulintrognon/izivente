import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { EdgedbModule } from './shared/edgedb/edgedb.module'

@Module({
  imports: [AuthModule, EdgedbModule],
})
export class AppModule {}
