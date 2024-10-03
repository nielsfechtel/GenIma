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
import { Calendar } from '@web/src/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@web/src/components/ui/form'
import { Input } from '@web/src/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@web/src/components/ui/popover'
import { cn } from '@web/src/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface APIKeysFormProps {
  api_keys: UserReturnSchema['api_keys']
}

export default function API_KeysForm({ api_keys }: APIKeysFormProps) {
  const t = useTranslations('API_KeysForm')
  const locale = useLocale()

  const apikeyFormSchema = z.object({
    name: z.string().min(4).max(50),
    expiry_date: z
      .date({
        required_error: t('an-expiry-date-is-required'),
      })
      .refine(
        (date) => {
          const nowDate = new Date()
          const dateIn1Day = new Date()
          dateIn1Day.setDate(nowDate.getDate() + 1)
          return dateIn1Day >= nowDate
        },
        {
          message: t('date-has-to-be-in-the-future'),
        }
      ),
  })

  const form = useForm<z.infer<typeof apikeyFormSchema>>({
    resolver: zodResolver(apikeyFormSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof apikeyFormSchema>) => {
    const result = await createAPIKey(
      data.name,
      data.expiry_date.toDateString()
    )
    if (result.success) {
      toast.success('Created!')
      form.reset()
    } else {
      if (typeof result.message === 'string') {
        toast.error(result.message)
      } else if (JSON.parse(result.message)[0].code === 'too_big') {
        toast.error(t('name-is-too-long'))
      } else {
        toast.error(t('error-try-again'))
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('create-a-new-api-key')}</CardTitle>
          <CardDescription>
            {`${t('generate-api-keys-to-query-the-backend')} ${t('all-keys-have-three-uses')}`}
            {t('for-information-on-how-to-use-the-api-check-out-the')}{' '}
            <Link target='_blank' className='underline underline-offset-2' href="/api/api-docs">{t('api-documentation')}.</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                disabled={api_keys.length === 3}
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
              <FormField
                control={form.control}
                name="expiry_date"
                disabled={api_keys.length === 3}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('expiry-date')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}>
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>{t('pick-a-date')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      {t('the-day-the-api-key-becomes-invalid')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={api_keys.length === 3} type="submit">
                {t('create-api-key')}
              </Button>
              <h3 className="text-red-400/70">
                {api_keys.length === 3 && `( ${t('key-limit-of-3-reached')} )`}
              </h3>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('api-keys')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 w-full divide-y-2">
          {api_keys.length === 0 ? (
            <span className="py-2">{t('no-api-keys-created-yet')}</span>
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
                              deleteAPIKey(api_key.value)
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
