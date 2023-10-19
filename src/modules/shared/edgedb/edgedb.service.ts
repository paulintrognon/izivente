import { Injectable } from '@nestjs/common'
import { $infer } from 'dbschema/edgeql-js/syntax'
import * as T from 'dbschema/edgeql-js/typesystem'
import * as edgedb from 'edgedb'

import edgedbGenerated from '../../../../dbschema/edgeql-js'

export const edb = edgedbGenerated

@Injectable()
export class EdgedbService {
  client: edgedb.Client

  constructor() {
    this.client = edgedb.createClient()
  }

  async onModuleInit() {
    await this.client.ensureConnected()
  }

  async run<Expr extends T.Expression>(expression: Expr): Promise<$infer<Expr>> {
    return await expression.run(this.client)
  }
}
