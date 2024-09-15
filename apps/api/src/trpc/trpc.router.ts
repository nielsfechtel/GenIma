import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { UserTrpcRouter } from '@api/users/user.trpc.router'
import { INestApplication, Injectable } from '@nestjs/common'
import * as trpcExpress from '@trpc/server/adapters/express'

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly authTrpcRouter: AuthTrpcRouter,
    private readonly userTrpcRouter: UserTrpcRouter
  ) {}

  appRouter = this.trpc.router({
    user: this.userTrpcRouter.userRouter,
    auth: this.authTrpcRouter.authRouter,
  })

  // this essentially 'ignores' NestJS-controllers and adds the trpc via express,
  // essentially running in parallel
  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: this.trpc.createContext,
      })
    )
  }
}

// this exports the TYPE of the AppRouter - meaning it includes all the
// type-information we can then use on the client, for that sweet tRPC-
// type-functionality.
export type AppRouter = TrpcRouter[`appRouter`]
