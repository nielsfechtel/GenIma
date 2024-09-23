'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
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

export default function ChangeEmailForm() {
  const t = useTranslations('ChangeEmailForm')

  const emailSchema = z
    .object({
      newEmail: z.string().email(),
      confirmEmail: z.string().email(),
    })
    .refine((data) => data.newEmail === data.confirmEmail, {
      message: t('emails-do-not-match'),
      path: ['confirmEmail'],
    })

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: '',
      confirmEmail: '',
    },
  })

  const onSubmit = (data: z.infer<typeof emailSchema>) => {
    console.log('Email data:', data)
    alert('UPDATE EMAIL HERE')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('update-email')}</CardTitle>
        <CardDescription>
          {t('change-your-account-email-address')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentEmail">{t('current-email')}</Label>
              <Input
                id="currentEmail"
                type="email"
                disabled
                value="current@example.com"
              />
            </div>
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('new-email')}</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="email"
                      placeholder={t('enter-your-new-email')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirm-new-email')}</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="email"
                      placeholder={t('confirm-your-new-email')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled type="submit">
              {t('update-email')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
