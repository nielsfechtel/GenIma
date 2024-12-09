'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { updateEmail } from '@web/src/actions/user.actions'
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
import { Label } from '@web/src/components/ui/label'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

interface EmailFormProps {
  currentEmail: string
}

export default function ChangeEmailForm({ currentEmail }: EmailFormProps) {
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

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    const { newEmail } = data
    const result = await updateEmail(newEmail)
    if (result?.success) {
      toast.success('Email sent - check your inbox!')
      form.reset()
    } else {
      toast.error(`Something wen't wrong - try again`)
    }
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
                value={currentEmail}
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
            <Button type="submit">{t('update-email')}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
