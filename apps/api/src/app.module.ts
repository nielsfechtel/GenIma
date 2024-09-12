import { AppController } from '@api/app.controller'
import { AppService } from '@api/app.service'
import { TrpcModule } from '@api/trpc/trpc.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env.local',
      isGlobal: true,
    }),
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
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
