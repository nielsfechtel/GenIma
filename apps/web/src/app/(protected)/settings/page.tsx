import { hasPassword } from '@web/src/actions/auth.actions'
import API_KeysForm from '@web/src/app/(protected)/settings/_components/API_KeysForm'
import ChangeEmailForm from '@web/src/app/(protected)/settings/_components/ChangeEmailForm'
import { ProfileForm } from '@web/src/app/(protected)/settings/_components/ProfileForm'
import { UpdatePassword } from '@web/src/app/(protected)/settings/_components/UpdatePassword'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@web/src/components/ui/tabs'
import { getTranslations } from 'next-intl/server'

export default async function SettingsPage() {
  const isPassworded = await hasPassword()
  const t = await getTranslations('Settings')

  return (
    <Tabs defaultValue="profile" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 h-fit gap-2 p-2">
        <TabsTrigger
          className="p-2 border border-foreground/20"
          value="profile"
        >
          {t('profile')}
        </TabsTrigger>
        <TabsTrigger
          className="p-2 border border-foreground/20"
          value="changeEmail"
        >
          {t('email')}
        </TabsTrigger>
        <TabsTrigger
          className="p-2 border border-foreground/20"
          value="updatePassword"
        >
          {t('password')}
        </TabsTrigger>
        <TabsTrigger
          className="p-2 border border-foreground/20"
          value="api_keys"
        >
          {t('api-keys')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileForm />
      </TabsContent>

      <TabsContent value="changeEmail">
        <ChangeEmailForm />
      </TabsContent>

      <TabsContent value="updatePassword">
        <UpdatePassword hasPassword={isPassworded} />
      </TabsContent>

      <TabsContent value="api_keys">
        <API_KeysForm />
      </TabsContent>
    </Tabs>
  )
}
