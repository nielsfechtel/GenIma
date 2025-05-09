import { API_Key, API_KeySchema } from '@api/api_key/schemas/api_key.schema'
import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { GeneratedImageTrpcRouter } from '@api/generated_image/generated_image.trpc.router'
import {
  GeneratedImage,
  GeneratedImageSchema,
} from '@api/generated_image/schemas/generated_image.schema'

import { Tier, TierSchema } from '@api/tier/schemas/tier.schema'
import { TierService } from '@api/tier/tier.service'
import { TrpcModule } from '@api/trpc/trpc.module'
import { TrpcRouter } from '@api/trpc/trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { User, UserSchema } from '@api/users/schemas/user.schema'
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
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
    MongooseModule.forFeature([
      { name: GeneratedImage.name, schema: GeneratedImageSchema },
      { name: User.name, schema: UserSchema },
      { name: Tier.name, schema: TierSchema },
      { name: API_Key.name, schema: API_KeySchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: "smtp.resend.com",
        secure: true,
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
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
    TierService,
    UserTrpcRouter,
    GeneratedImageTrpcRouter,
  ],
})
export class AppModule {}
