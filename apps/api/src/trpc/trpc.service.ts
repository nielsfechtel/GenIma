import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { initTRPC, TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { OAuth2Client } from 'google-auth-library'
import { createContext } from 'vm'

@Injectable()
export class TrpcService {
  constructor(private jwtService: JwtService) {}

  createContext = async ({
    req,
    res,
  }: trpcExpress.CreateExpressContextOptions) => {
    // This creates a context; it will be available as `ctx` in all resolvers
    let user = null

    if (req.headers.authorization) {
      // split token; if it's in the Bearer-token-format, the second entry is the token
      const token = req.headers.authorization.split(' ')[1]

      // try decoding with our JWT-key first - if it fails, it's a google-token (most likely)
      try {
        user = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_KEY,
        })
      } catch (error) {
        // this is a JsonWebTokenError: invalid algorithm-error
        // there probably is a better way than letting this fail
      }
      if (user) {
        return {
          user,
        }
      }

      // next try decoding with Google, in case it's a Google-ID-token
      const client = new OAuth2Client()

      // No pem found for envelope here sometimes so throw
      // https://stackoverflow.com/questions/61203872/no-pem-found-for-envelope-algrs256-kid5a66482db3800c83c63-typjwt

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.AUTH_GOOGLE_ID,
      })
      user = ticket.getPayload()

      if (user) {
        return {
          user,
        }
      }
    }

    return {}
  }

  // This doesn't work in classes - I think - but you should still be able to get this type by
  // doing typeof <the-rest>, right?
  // type Context = Awaited<ReturnType<typeof this.createContext>>
  // or maybe without typeof as it's redundant ?
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

    // I'm not sure why we need to return ctx again here - would it be 'reset'/deleted otherwise?
    return opts.next({
      ctx: {
        // ✅ user value is known to be non-null now
        user: ctx.user,
      },
    })
  })

  protectedAPIKeyProcedure = this.trpc.procedure.use(async function isAPIKeyAuthed(opts) {
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
