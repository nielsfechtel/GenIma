'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { createAPIKey } from '@web/src/actions/apikeys.actions'
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
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function API_KeysForm() {
  const t = useTranslations('API_KeysForm')
  const session = useSession()

  // this should be taken from the DB-schema..
  const apikeyFormSchema = z.object({
    name: z.string().min(4),
    // https://ui.shadcn.com/docs/components/date-picker
    // https://stackoverflow.com/questions/77810607/how-to-use-shadcn-ui-range-date-picker-inside-form

    // expire_at: z
    //   .object(
    //     {
    //       from: z.date(),
    //       to: z.date().optional(),
    //     },
    //     { required_error: 'Date is required.' }
    //   )
    //   .refine((date) => {
    //     return !!date.to
    //   }, 'End Date is required.'),
  })

  const form = useForm<z.infer<typeof apikeyFormSchema>>({
    resolver: zodResolver(apikeyFormSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof apikeyFormSchema>) => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3)
    const result = await createAPIKey(data.name, date.toISOString())
    if (result.success) {
      toast.success('Created!')
      form.reset()
    } else {
      toast.error(`Error - ${result.message}`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('api-keys')}</CardTitle>
          <CardDescription>
            {t('generate-api-keys-to-query-the-backend')}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-8">
          <h3 className="text-red-400/70">
            {session?.data?.user.api_keys.length === 3 &&
              '( Key-limit of 3 reached )'}
          </h3>
          <ul>
            {!session.data.user.api_keys ? (
              <span>{t('no-api-keys-created-yet')}</span>
            ) : (
              session.data.user.api_keys.map((api_key, key) => {
                return (
                  <li key={key}>
                    <span>{api_key.name}</span> : <span>{api_key.value}</span>
                  </li>
                )
              })
            )}
          </ul>
        </CardFooter>
      </Card>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter-name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">{t('create-api-key')}</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  )
}
