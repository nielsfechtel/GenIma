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
    async jwt({ token, user, account, profile, trigger }) {
      let newUser
      let accessToken
      const date = new Date()
      let expires_at = date.setMonth(date.getMonth() + 3)
      let refreshToken

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
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError('Missing refresh_token')

        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token!,
            }),
          })

          const tokensOrError = await response.json()

          if (!response.ok) throw tokensOrError

          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          }

          token.accessToken = newTokens.access_token
          token.expires_at = Math.floor(
            Date.now() / 1000 + newTokens.expires_in
          )
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token)
            token.refreshToken = newTokens.refresh_token
          return token
        } catch (error) {
          console.error('Error refreshing access_token', error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError'
          return token
        }
      }
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
