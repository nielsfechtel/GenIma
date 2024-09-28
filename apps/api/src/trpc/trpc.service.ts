import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { initTRPC, TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { createContext } from 'vm'

@Injectable()
export class TrpcService {
  constructor(private jwtService: JwtService) {}

  createContext = async ({
    req,
    res,
  }: trpcExpress.CreateExpressContextOptions) => {
    // This creates a context; it will be available as `ctx` in all resolvers
    let tokenContent = null

    if (req.headers.authorization) {
      // split token; if it's in the Bearer-token-format, the second entry is the token
      const token = req.headers.authorization.split(' ')[1]

      // try decoding with our JWT-key first - if it fails, it's a google-token (most likely)
      try {
        tokenContent = await this.jwtService.verifyAsync(token)
      } catch (error) {
        return {}
      }

      if (tokenContent) {
        // is it a normal auth-token or an API-key-token?
        if (tokenContent.is_api_key) {
          return {
            key: tokenContent,
          }
        } else {
          return {
            user: tokenContent,
          }
        }
      }
    }

    return {}
  }

  trpc = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create()

  // for testing - https://trpc.io/docs/server/server-side-calls
  createCallerFactory = this.trpc.createCallerFactory

  // rename the normal procedure more clearly to show it is public
  publicProcedure = this.trpc.procedure

  // protectedProcedure requiring a valid Bearer-token to be present
  protectedProcedure = this.trpc.procedure.use(async function isAuthed(opts) {
    const { ctx } = opts

    // user is nullable
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return opts.next({
      ctx: {
        user: ctx.user,
      },
    })
  })

  protectedAPIKeyProcedure = this.trpc.procedure.use(
    async function isAPIKeyAuthed(opts) {
      const { ctx } = opts
      console.log('protectedAPIKeyProcedure ctx is', ctx)

      // key is nullable
      if (!ctx.key || !ctx.key.is_api_key) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return opts.next({
        ctx: {
          key: ctx.key,
        },
      })
    }
  )

  router = this.trpc.router
  mergeRouters = this.trpc.mergeRouters
}
