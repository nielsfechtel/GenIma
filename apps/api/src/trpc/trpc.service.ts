import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { initTRPC, TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { createContext } from 'vm'

@Injectable()
export class TrpcService {
  constructor(private jwtService: JwtService) {}

  createContext = async function ({
    req,
    res,
  }: trpcExpress.CreateExpressContextOptions) {
    // This creates a context; it will be available as `ctx` in all resolvers
    async function getUserFromHeader() {
      if (req.headers.authorization) {
        // split token; if it's in the Bearer-token-format, the second entry is the token
        const user = this.jwtService.verify(
          req.headers.authorization.split(' ')[1]
        )
        return user
      }
      return null
    }
    const user = await getUserFromHeader()
    return {
      user,
    }
  }

  // This doesn't work in classes - I think - but you should still be able to get this type by
  // doing typeof <the-rest>, right?
  // type Context = Awaited<ReturnType<typeof this.createContext>>
  // or maybe without typeof as it's redundant ?
  trpc = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create()

  // rename the normal procedure more clearly to show it is public
  publicProcedure = this.trpc.procedure

  // protectedProcedure requiring a valid Bearer-token to be present
  protectedProcedure = this.trpc.procedure.use(async function isAuthed(opts) {
    const { ctx } = opts

    // user is nullable
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    // I'm not sure why we need to return ctx again here - would it be 'reset'/deleted otherwise?
    return opts.next({
      ctx: {
        // ✅ user value is known to be non-null now
        user: ctx.user,
      },
    })
  })

  router = this.trpc.router
  mergeRouters = this.trpc.mergeRouters
}
