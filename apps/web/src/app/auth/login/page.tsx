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
        redirectTo: searchParams.get('callbackUrl') ?? DEFAULT_LOGIN_REDIRECT,
      })

      if (result.success) {
        return {
          data: null,
          message: 'User credentials are valid.',
          success: true,
        }

      } else {
        return router.push(`/auth/login?error=${result.message}.`)
      }
    } catch (err) {
      return router.push(`/auth/login?error=Error logging in - try again`)
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
          <h3 className="text-red-500 p-2">{searchParams.get('error').split('.')[0]}.</h3>
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
