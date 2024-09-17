import { trpc } from '@web/src/app/trpc'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { authConfig } from './auth.config'

async function getUser(email: string, password: string): Promise<any> {
  return {
    id: 1,
    name: 'test user',
    email: email,
    password: password,
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
        // email: { label: 'email', type: 'text' },
        // password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await trpc.auth.login.query(credentials)

        return user ?? null
      },
    }),
    Google,
  ],
  callbacks: {
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
      return session
    },
  },
})
