import { TrpcRouter } from '@api/trpc/trpc.router'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security practices
  app.enableCors()
  app.use(helmet())

  // TRPC setup
  const trpc = app.get(TrpcRouter)
  trpc.applyMiddleware(app)

  // get port
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('PORT')
  if (!port) {
    throw new Error(`Environment variable port is missing`)
  }

  await app.listen(port)
}
bootstrap()
