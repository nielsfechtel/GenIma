import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

// we have this here because it is used in two places - middleware.ts and auth.ts
export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/',
    signIn: '/',
    signOut: '/',
  },
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user

      return isAuthenticated
    },
  },
  providers: [Google],
} satisfies NextAuthConfig
