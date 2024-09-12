import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Error from 'next/error'
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
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const user = await fetch('http://localhost:4000/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } catch (error) {
          throw new Error(error.message)
        }

        return user ?? null
      },
    }),
  ],
})
