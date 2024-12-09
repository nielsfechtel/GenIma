// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { UserReturnSchema } from '@api/schemas/user-return.schema'
import { trpc } from '@web/src/trpc'
import NextAuth, { CredentialsSignin } from 'next-auth'
import { Provider } from 'next-auth/providers'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

// as defined in the Docs here https://authjs.dev/getting-started/typescript, we can augment tye Types for
// these various AuthJS-objects to match what we expect in our app.
declare module 'next-auth' {
  interface Session {
    accessToken: string
    user: UserReturnSchema
    error?: 'RefreshTokenError'
  }
}

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'email', type: 'text' },
      password: { label: 'password', type: 'password' },
    },
    async authorize(credentials: { email: string; password: string }) {
      try {
        return await trpc.auth.login.query({
          email: credentials.email,
          password: credentials.password,
        })
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new CredentialsSignin(error.message)
        }
      }
    },
  }),
  Google,
]

export const { auth, signIn, signOut, handlers } = NextAuth({
  // trustHost is set to ture  to make it work when using Docker, fails otherwise
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        // check if the account is verified
        if (!profile?.email_verified)
          return '/auth/login?error=This email is not verified.'

        // next we need to try to loginWithGoogle (this will check if a user exists, otherwise sign them up)
        try {
          await trpc.auth.loginWithGoogle.mutate({
            googleIDtoken: account.id_token!,
          })
        } catch (error: unknown) {
          if (error instanceof Error) {
            // @ts-expect-error Error-type from trpc
            const errorMessage = error.meta.responseJSON[0].error.message
            return `/auth/login?error=${errorMessage}`
          }
        }
      }

      return true
    },
    async jwt({ token, user, account, trigger, session }) {
      let newUser
      let accessToken

      // session here is a session-update-object, sent over by updateSession
      // See https://next-auth.js.org/getting-started/client#updating-the-session
      if (trigger === 'update') {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.user.firstName = session.firstName
        token.user.lastName = session.lastName
      }

      if (trigger === 'signIn') {
        // only now user, account and profile are not undefined
        // we want to extend token.user to satisfy UserReturnSchema

        // now, we know that user is, according to the docs:
        // "Either the result of the OAuthConfig.profile or the CredentialsConfig.authorize callback"
        if (account?.provider === 'credentials') {
          accessToken = user.accessToken
          const data: UserReturnSchema = user.data

          newUser = {
            _id: data._id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            tier: data.tier,
            api_keys: data.api_keys,
            images: data.images,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          } satisfies UserReturnSchema
        } else if (account?.provider === 'google') {
          if (!account.id_token) {
            throw new Error('no google id_token')
          }

          const result = await trpc.auth.loginWithGoogle.mutate({
            googleIDtoken: account.id_token,
          })
          const returnedUser: UserReturnSchema = result.data
          accessToken = result.accessToken

          newUser = {
            _id: returnedUser._id,
            email: returnedUser.email,
            firstName: returnedUser.firstName,
            lastName: returnedUser.lastName,
            role: returnedUser.role,
            tier: returnedUser.tier,
            api_keys: returnedUser.api_keys,
            images: returnedUser.images,
            createdAt: returnedUser.createdAt,
            updatedAt: returnedUser.updatedAt,
          } satisfies UserReturnSchema
        }

        return {
          ...token,
          accessToken,
          user: newUser,
        }
      }

      return token
    },
    // setting the session's user to what we got from the token (see function above!)
    async session({ session, token }) {
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
      }
    },
  },
})
