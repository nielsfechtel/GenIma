'use client'

import { UserReturnSchema } from '@api/schemas/user-return.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAPIKey, deleteAPIKey } from '@web/src/actions/apikeys.actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@web/src/components/ui/alert-dialog'
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
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface APIKeysFormProps {
  api_keys: UserReturnSchema['api_keys']
}

export default function API_KeysForm({ api_keys }: APIKeysFormProps) {
  const t = useTranslations('API_KeysForm')
  const locale = useLocale()

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('create-a-new-api-key')}</CardTitle>
          <CardDescription>
            {`${t('generate-api-keys-to-query-the-backend')} ${t('all-keys-have-three-uses')}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit">{t('create-api-key')}</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('api-keys')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 w-full divide-y-2">
          <h3 className="text-red-400/70">
            {api_keys.length === 3 && `( ${t('key-limit-of-3-reached')} )`}
          </h3>

          {!api_keys ? (
            <span>{t('no-api-keys-created-yet')}</span>
          ) : (
            api_keys.map((api_key, key) => {
              return (
                <ul
                  key={key}
                  className="w-md max-w-xl space-y-2 border-foreground/20 py-2">
                  <li>
                    <span className="font-semibold">{t('name')}: </span>
                    <span>{api_key.name}</span>
                  </li>
                  <li>
                    <span className="font-semibold">{t('value')}: </span>
                    <div className="break-words">{api_key.value}</div>
                  </li>
                  <li>
                    <span className="font-semibold">{t('uses-left')}: </span>
                    <span className="break-words">{api_key.usesLeft}</span>
                  </li>
                  <li>
                    <span className="font-semibold">{t('expires-on')}: </span>
                    <span className="break-words">
                      {new Date(api_key.expiry_date).toLocaleDateString(locale)}{' '}
                      (
                      {`${Math.round(
                        (new Date(api_key.expiry_date).getTime() -
                          new Date().getTime()) /
                          (24 * 60 * 60 * 1000)
                      )} ${t('days')}`}
                      )
                    </span>
                  </li>
                  <li>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div className="py-4">
                          <Button variant="destructive_lighter">
                            {t('delete-key')}
                          </Button>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('are-you-sure-you-want-to-delete-the-key')}
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.preventDefault()
                              deleteAPIKey(api_key.name)
                            }}
                            className="bg-destructive text-destructive-foreground">
                            {t('delete-key')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                </ul>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
