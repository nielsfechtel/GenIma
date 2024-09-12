import { AppController } from '@api/app.controller'
import { AppService } from '@api/app.service'
import { TrpcModule } from '@api/trpc/trpc.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env.local',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_URI),
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
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
