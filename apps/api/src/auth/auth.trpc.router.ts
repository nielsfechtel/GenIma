// modules/user/user.trpc.ts
import { AuthService } from '@api/auth/auth.service'
import { TrpcService } from '@api/trpc/trpc.service'
import { ChangePasswordSchema } from '@api/zod_schemas/change-password.schema'
import { LoginSchema } from '@api/zod_schemas/login.schema'
import { SignUpSchema } from '@api/zod_schemas/signup.schema'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class AuthTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly authService: AuthService
  ) {}

  authRouter = this.trpc.router({
    signUp: this.trpc.publicProcedure
      .input(SignUpSchema)
      .mutation(async ({ input }) => {
        const { firstName, lastName, password, email } = input
        const result = await this.authService.signUp({
          firstName,
          lastName,
          password,
          email,
        })
        return result
      }),

    login: this.trpc.publicProcedure
      .input(LoginSchema)
      .query(async ({ input }) => {
        const { email, password } = input
        return this.authService.signIn(email, password)
      }),

    changePassword: this.trpc.protectedProcedure
      .input(ChangePasswordSchema)
      .mutation(async ({ ctx, input }) => {
        // when logged in and old password fits, we can just change it
        return this.authService.updatePassword(
          ctx.user.email,
          input.oldPassword,
          input.newPassword
        )
      }),

    resetPassword: this.trpc.publicProcedure.query(() => {
      // This is when not logged in (check for that)
      // Then, send a reset-password-email with a token.action of "RESET_PASSWORD"
    }),

    // Depending on token.action, this will verify the user,
    // change the password or delete the user
    verifyToken: this.trpc.publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(({ input }) => {
        return this.authService.verifyToken(input.token)
      }),
  })
}
