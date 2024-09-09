import { TrpcRouter } from '@api/trpc/trpc.router'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  const trpc = app.get(TrpcRouter)
  trpc.applyMiddleware(app)

  // get port
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('port')
  if (!port) {
    throw new Error(`Environment variable port is missing`)
  }

  await app.listen(port)
}
bootstrap()
