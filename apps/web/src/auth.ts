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
      } catch (error) {
        const errorMessage = error.meta.responseJSON[0].error.message

        throw new CredentialsSignin(errorMessage)
      }
    },
  }),
  Google({
    // Google requires "offline" access_type to provide a `refresh_token`
    authorization: { params: { access_type: 'offline', prompt: 'consent' } },
  }),
]

export const { auth, signIn, signOut, handlers } = NextAuth({
  // this is to make it work when using Docker, fails otherwise
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
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google') {
        // check if the account is verified
        if (!profile?.email_verified)
          return '/auth/login?error=This email is not verified.'

        // next we need to try to loginWithGoogle (this will check if a user exists, otherwise sign them up)
        try {
          await trpc.auth.loginWithGoogle.mutate({
            googleIDtoken: account.id_token!,
          })
        } catch (error) {
          const errorMessage = error.meta.responseJSON[0].error.message
          return `/auth/login?error=${errorMessage}`
        }
      }

      return true
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      let newUser
      let accessToken
      const date = new Date()
      let expires_at = date.setMonth(date.getMonth() + 3)
      let refreshToken

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
          const {
            email,
            firstName,
            lastName,
            profileImage,
            role,
            tier,
            api_keys,
          } = data
          newUser = {
            email,
            firstName,
            lastName,
            profileImage,
            role,
            tier,
            api_keys,
          } satisfies UserReturnSchema
        } else if (account?.provider === 'google') {
          accessToken = account.id_token
          expires_at = account.expires_at
          refreshToken = account.refresh_token

          const result = await trpc.auth.loginWithGoogle.mutate({
            googleIDtoken: account.id_token,
          })
          const returnedUser = result.data

          newUser = {
            email: returnedUser.email,
            firstName: returnedUser.firstName,
            lastName: returnedUser.lastName,
            profileImage: returnedUser.profileImage,
            role: returnedUser.role,
            tier: returnedUser.tier,
          } satisfies UserReturnSchema
        }

        return {
          ...token,
          accessToken,
          expires_at,
          refreshToken,
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
