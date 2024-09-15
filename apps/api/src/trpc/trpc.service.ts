import { Injectable } from '@nestjs/common'
import { initTRPC } from '@trpc/server'

@Injectable()
export class TrpcService {
  trpc = initTRPC.create()

  // name the normal procedure more clearly as public
  publicProcedure = this.trpc.procedure

  router = this.trpc.router
  mergeRouters = this.trpc.mergeRouters
}
