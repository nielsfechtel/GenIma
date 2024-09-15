import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'

import { AuthGuard } from '@api/auth/auth.guard'
import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { User, UserSchema } from '@api/users/schemas/user.schema'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '60s' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  // controllers: [AuthController],
  providers: [
    {
      // The great NestJS-Docs say:
      // First, register the AuthGuard as a global guard using the following construction (in any module, for example, in the AuthModule):
      // That way, everything is by default guarded; and you must use @Public to make something not protected.
      // This is a custom defined Decorator! So cool! In public-strategy.ts!
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthTrpcRouter,
    AuthService,
    TrpcService,
  ],
  exports: [AuthService, AuthTrpcRouter],
})
export class AuthModule {}
