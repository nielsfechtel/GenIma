// modules/user/user.trpc.ts
import { AuthService } from '@api/auth/auth.service'
import { ChangePasswordSchema } from '@api/schemas/change-password.schema'
import { LoginSchema } from '@api/schemas/login.schema'
import { SignUpSchema } from '@api/schemas/signup.schema'
import { TrpcService } from '@api/trpc/trpc.service'
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
        return await this.authService.signUp(input)
      }),

    login: this.trpc.publicProcedure
      .input(LoginSchema)
      .query(async ({ input }) => {
        const { email, password } = input
        return await this.authService.signIn(email, password)
      }),

    loginWithGoogle: this.trpc.publicProcedure
      .input(z.object({ googleIDtoken: z.string() }))
      .mutation(async ({ input }) => {
        return await this.authService.signinWithGoogle(input.googleIDtoken)
      }),

    changePassword: this.trpc.protectedProcedure
      .input(ChangePasswordSchema)
      .mutation(async ({ ctx, input }) => {
        // a google-signed-up user does not yet have a password
        return this.authService.updatePassword(
          ctx.user.email,
          input.oldPassword || '',
          input.newPassword
        )
      }),

    resetPassword: this.trpc.publicProcedure.query(() => {
      // This is when not logged in (check for that)
      // Then, send a reset-password-email with a token.action of "RESET_PASSWORD"
    }),

    // Depending on token.action, this will verify the user,
    // change the password or delete the user
    executeToken: this.trpc.publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        return await this.authService.executeToken(input.token)
      }),

    deleteAccount: this.trpc.protectedProcedure.query(async ({ ctx }) => {
      return await this.authService.sendDeleteAccountEmail(ctx.user.email)
    }),

    changeEmail: this.trpc.protectedProcedure
      .input(z.object({ newEmail: z.string().email() }))
      .query(async ({ ctx, input }) => {
        return await this.authService.sendChangeEmailEmail(
          input.newEmail,
          ctx.user.email
        )
      }),
  })
}
