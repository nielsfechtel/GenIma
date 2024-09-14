import { TrpcRouter } from '@api/trpc/trpc.router'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Niels Graduation Project API')
    .setDescription("The API-Backend for Niels' CLA Graduation Project")
    .setVersion('0.1')
    .addTag('AI')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // Security practices
  app.enableCors()

  // TRPC setup
  const trpc = app.get(TrpcRouter)
  trpc.applyMiddleware(app)

  app.use(helmet())

  // get port
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('PORT')
  if (!port) {
    throw new Error(`Environment variable port is missing`)
  }

  await app.listen(port)
}
bootstrap()
