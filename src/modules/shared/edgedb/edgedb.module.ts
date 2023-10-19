import { Global, Module } from '@nestjs/common'

import { EdgedbService } from './edgedb.service'

@Global()
@Module({
  providers: [EdgedbService],
  exports: [EdgedbService],
})
export class EdgedbModule {}
