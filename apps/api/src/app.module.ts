import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { GeneratedImageTrpcRouter } from '@api/generated_image/generated_image.trpc.router'
import { TrpcModule } from '@api/trpc/trpc.module'
import { TrpcRouter } from '@api/trpc/trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { UserTrpcRouter } from '@api/users/user.trpc.router'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { ApiKeyModule } from './api_key/api_key.module'
import { AuthModule } from './auth/auth.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { GeneratedImageModule } from './generated_image/generated_image.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? './config/.env.local'
          : process.env.NODE_ENV === 'test'
            ? './config/.env.test'
            : './config/.env.prod',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '60s' },
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
    MailerModule.forRoot({
      transport: {
        host: process.env.RESEND_HOST,
        auth: {
          user: process.env.RESEND_USERNAME,
          pass: process.env.RESEND_PASSWORD,
        },
      },
      defaults: {
        from: `Hello ${process.env.HELLO_EMAIL_ADDRESS}`,
      },
      template: {
        dir: './email_templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TrpcModule,
    AuthModule,
    UsersModule,
    ApiKeyModule,
    GeneratedImageModule,
    CloudinaryModule,
  ],
  providers: [
    TrpcRouter,
    AuthTrpcRouter,
    GeneratedImageService,
    TrpcService,
    UserTrpcRouter,
    GeneratedImageTrpcRouter,
  ],
})
export class AppModule {}
