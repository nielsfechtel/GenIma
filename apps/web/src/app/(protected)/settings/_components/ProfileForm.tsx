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

export function ProfileForm() {
  const t = useTranslations('ProfileForm')

  const profileSchema = z.object({
    firstName: z.string().min(2, t('first-name-must-be-at-least-2-characters')),
    lastName: z
      .string()
      .min(2, t('last-name-must-be-at-least-2-characters'))
      .optional(),
  })

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    console.log('Profile data:', data)
    // Handle profile update logic here
  }

  return (
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
            <div className="flex flex-col items-center space-y-4">
              {/* <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar> */}
              <Label
                htmlFor="picture"
                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                {t('upload-picture')}
              </Label>
              {/* <Input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
              /> */}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('first-name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('enter-your-first-name')}
                        {...field}
                      />
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
                        placeholder={t('enter-your-last-name')}
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
  )
}
