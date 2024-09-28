import { TrpcRouter } from '@api/trpc/trpc.router'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { CoreMessage } from 'ai'
import helmet from 'helmet'
import { expressHandler } from 'trpc-playground/handlers/express'
import * as cmon from 'trpc-playground/handlers/'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  })

  // Security practices
  app.enableCors()
  app.use(helmet())

  // tRPC setup
  const trpc = app.get(TrpcRouter)
  trpc.applyMiddleware(app)

  // get port
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('PORT')
  if (!port) {
    throw new Error(`Environment variable port is missing`)
  }

  const trpcApiEndpoint = '/trpc'
  const playgroundEndpoint = '/trpc-playground'

  // app.use(
  //   trpcApiEndpoint,
  //   trpcExpress.createExpressMiddleware({
  //     router: appRouter,
  //   })
  // )

  app.use(
    playgroundEndpoint,
    await expressHandler({
      trpcApiEndpoint,
      playgroundEndpoint,
      router: appRouter,
    })
  )

  await app.listen(port)

  const messages: CoreMessage[] = []
}
bootstrap()
