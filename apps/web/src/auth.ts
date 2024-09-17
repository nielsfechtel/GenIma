import { trpc } from '@web/src/app/trpc'
import NextAuth from 'next-auth'
import { Provider } from 'next-auth/providers'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

// this was in auth.config.ts:
/*
 callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user

      return isAuthenticated
    },
  },
*/

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'email', type: 'text' },
      password: { label: 'password', type: 'password' },
    },
    async authorize(credentials) {
      try {
        const user = await trpc.auth.login.query({
          email: credentials.email,
          password: credentials.password,
        })

        return user ?? null
      } catch (error: unknown) {
        return {
          error: error,
        }
      }
    },
  }),
  Google,
]

// this is used in the /login-page, also defined in pages below
export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== 'credentials')

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/error',
    signIn: '/login',
    signOut: '/logout',
  },
  providers,
  callbacks: {
    // interestingly, this signIn-callback below is called BEFORE our server-action in login/page.tsx
    // actually catches the thrown error. Assuming we return false/throw an error in here.
    // So we can check out the error and yeah idk
    // from the docs https://next-auth.js.org/configuration/callbacks#sign-in-callback:
    // When using the Credentials Provider the user object is the response returned from the
    // authorize callback and the profile object is the raw body of the HTTP POST submission.
    async signIn({ user, account, profile, email, credentials }) {
      if (user?.error) {
        console.log('in signIn-callback, we got an error:', user.error)

        throw new Error(user.error)
      }
      return true
    },
    jwt({ token, user }) {
      // user is what we got back from the backend
      // token is what we want to now set based on 'user'
      if (user) {
        token.user = user.data
        token.accessToken = user.accessToken
      }
      return token
    },
    // setting the session's user to what we got from the token (see function above!)
    session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      console.log('in session, set session to', session)

      return session
    },
  },
})
