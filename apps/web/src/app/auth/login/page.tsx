'use client'

import { LoginSchema } from '@api/schemas/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { myOwnServerSideSignIn } from '@web/src/actions/auth.actions'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@web/src/components/ui/form'
import { Input } from '@web/src/components/ui/input'
import { DEFAULT_LOGIN_REDIRECT } from '@web/src/routes'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = LoginSchema

export default function SignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleCredentialSignin(values: z.infer<typeof formSchema>) {
    try {
      const result = await myOwnServerSideSignIn({
        email: values.email,
        password: values.password,
        // redirect: false according to https://stackoverflow.com/a/76752733/5272905
        // redirect: false,
        redirectTo: searchParams.get('callbackUrl') ?? DEFAULT_LOGIN_REDIRECT,
      })

      return {
        data: null,
        message: 'User credentials are valid.',
        success: true,
      }
    } catch (err) {
      // So I have no idea why, but the error-message here is not the one I threw in auth.ts, but
      // AuthJS adds a "Read more at https://errors.authjs.dev" onto it after the end.
      // Since I'm done with this for now, I just split it by '.' and take the first argument,
      // as my error-message ends with a '.'
      const message = err.message.split('.')[0]

      return router.push(`/auth/login?error=${message}.`)
    }
  }

  async function handleGoogleSignup() {
    await signIn('google', {
      redirectTo: searchParams.get('callbackUrl') ?? DEFAULT_LOGIN_REDIRECT,
    })
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {searchParams.has('error') && (
          <h3 className="text-red-500 p-2">{searchParams.get('error')}</h3>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCredentialSignin)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input autoFocus type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <Button
          onClick={handleGoogleSignup}
          variant="outline"
          className="w-full"
        >
          Login with Google
        </Button>
        <div className="text-center text-sm">
          {`Don't have an account yet? `}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
