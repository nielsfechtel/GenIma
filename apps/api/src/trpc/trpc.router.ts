import { TrpcService } from '@api/trpc/trpc.service'
import { INestApplication, Injectable } from '@nestjs/common'
import * as trpcExpress from '@trpc/server/adapters/express'
import { z } from 'zod'

@Injectable()
export class TrpcRouter {
  constructor(private readonly trpc: TrpcService) {}

  appRouter = this.trpc.router({
    hello: this.trpc.procedure
      .input(
        z.object({
          name: z.string().optional(),
        })
      )
      .query(({ input }: any) => {
        const { name } = input
        return {
          greeting: `Hello ${name ? name : `Bilbo`}`,
        }
      }),

    /*
    again from https://www.tomray.dev/nestjs-nextjs-trpc:
    The beautiful thing (yes I genuinely do find it beautiful) is now I can use dependency injection inside
    the routers. This means I can inject other services into the tRPC routers, keeping the routers clean,
    minimal and not full of business logic. Here's an example of what I mean:

    As you add more routers this could end up being quite long and messy, so you will likely want
    to make use of merging routers. (https://trpc.io/docs/server/merging-routers)
    */
    getUsers: this.trpc.procedure
      .input(
        z.object({
          name: z.string(),
        })
      )
      .query(async ({ input }: any) => {
        const { name } = input
        // random example showing you how you can now use dependency injection
        return [] // await this.userService.getUsers(name)
      }),
  })

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
      })
    )
  }
}

export type AppRouter = TrpcRouter[`appRouter`]
