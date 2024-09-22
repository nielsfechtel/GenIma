'use client'

import { LoginSchema } from '@api/zod_schemas/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = LoginSchema

export default function SignupForm(props: {
  searchParams: { callbackUrl: string }
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleCredentialSignin(values: z.infer<typeof formSchema>) {
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirectTo: props.searchParams?.callbackUrl ?? '',
    })
    console.log('result is', result)
  }

  async function handleGoogleSignup() {
    const result = await signIn('google', {
      redirectTo: props.searchParams?.callbackUrl ?? '',
    })
    console.log('result is', result)
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
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
                    <Input type="email" {...field} />
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
