import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { GeneratedImageTrpcRouter } from '@api/generated_image/generated_image.trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { UserTrpcRouter } from '@api/users/user.trpc.router'
import { INestApplication, Injectable } from '@nestjs/common'
import * as trpcExpress from '@trpc/server/adapters/express'
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi'
const swaggerUI = require('swagger-ui-express')

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly authTrpcRouter: AuthTrpcRouter,
    private readonly userTrpcRouter: UserTrpcRouter,
    private readonly generatedImageTrpcRouter: GeneratedImageTrpcRouter
  ) {}

  appRouter = this.trpc.router({
    user: this.userTrpcRouter.userRouter,
    auth: this.authTrpcRouter.authRouter,
    generatedImage: this.generatedImageTrpcRouter.generatedImageRouter,
  })

  // this essentially 'ignores' NestJS-controllers and adds the trpc via express,
  // essentially running in parallel
  async applyMiddleware(app: INestApplication) {
    app.use(
      `/api/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: this.trpc.createContext,
      })
    )

    app.use(
      '/api',
      createOpenApiExpressMiddleware({
        router: this.appRouter,
        createContext: this.trpc.createContext,
      })
    )

    const openAPIDocument = generateOpenApiDocument(this.appRouter, {
      title: 'Niels Graduation Project Exposed API',
      description: 'OpenAPI compliant REST API built using tRPC with NestJS',
      version: '1.0.0',
      baseUrl: 'http://localhost:4000/api',
      docsUrl: 'https://github.com/jlalmes/trpc-openapi',
      tags: ['images'],
    })

    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPIDocument))
  }
}

// this exports the TYPE of the AppRouter - meaning it includes all the
// type-information we can then use on the client, for that sweet tRPC-
// type-functionality.
export type AppRouter = TrpcRouter[`appRouter`]
