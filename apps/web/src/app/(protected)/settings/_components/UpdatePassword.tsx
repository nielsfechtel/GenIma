'use client'

import { SignUpSchema } from '@api/schemas/signup.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePassword } from '@web/actions/auth.actions'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// pick the password from our schema (for min- and max-length, etc), then add the new fields and custom validation
const passwordSchema = SignUpSchema.pick({ password: true })
  .extend({ oldPassword: z.string(), confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export function UpdatePassword(props: { hasPassword: boolean }) {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    await updatePassword(data.oldPassword || '', data.password)
    form.reset()
  }

  const t = useTranslations('UpdatePassword')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('change-password')}</CardTitle>
        <CardDescription>{t('update-your-password-here')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {props.hasPassword ? (
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('current-password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <h3>{t('you-signed-up-via-google-set-a-new-password')}</h3>
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new-password')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirm-new-password')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">{t('update-password')}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
