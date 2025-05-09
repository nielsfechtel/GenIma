'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { updateNames } from '@web/src/actions/user.actions'
import DeleteAccountAlert from '@web/src/app/(protected)/settings/_components/DeleteAccountAlert'
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
import { toast } from 'sonner'
import * as z from 'zod'

interface ProfileFormProps {
  firstName: string
  lastName: string | null
}

export default function ImageComponent({
  firstName,
  lastName,
}: ProfileFormProps) {
  const t = useTranslations('ProfileForm')

  const profileSchema = z.object({
    firstName: z.string().min(2, t('first-name-must-be-at-least-2-characters')),
    lastName: z.string().optional(),
  })

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    const { firstName, lastName } = data
    const result = await updateNames(firstName, lastName || '')
    if (result?.success) {
      toast.success('Names updated!')
      form.reset()
    } else {
      toast.error(`Something wen't wrong - try again`)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile-information')}</CardTitle>
          <CardDescription>
            {t('update-your-profile-details-here')}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('first-name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={firstName} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('last-name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lastName ?? 'no last name'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">{t('save-changes')}</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <DeleteAccountAlert />
      </Card>
    </div>
  )
}
