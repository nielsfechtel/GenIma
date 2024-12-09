import { hasPassword } from '@web/src/actions/auth.actions'
import { getUser } from '@web/src/actions/user.actions'
import API_KeysForm from '@web/src/app/(protected)/settings/_components/API_KeysForm'
import ChangeEmailForm from '@web/src/app/(protected)/settings/_components/ChangeEmailForm'
import ProfileForm from '@web/src/app/(protected)/settings/_components/ProfileForm'
import { UpdatePassword } from '@web/src/app/(protected)/settings/_components/UpdatePassword'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@web/src/components/ui/tabs'
import { getTranslations } from 'next-intl/server'

type User = {
  email: string
  firstName: string
  lastName: string
  isPassworded: boolean
  api_keys: unknown[]
}

export default async function SettingsPage() {
  const tabs = ['profile', 'email', 'password', 'api_keys']

  const isPassworded = await hasPassword()
  const user = (await getUser()) as User
  const t = await getTranslations('Settings')

  return (
    // using a modified controlled Tabs-component (tabs.tsx), thank you KATT
    // https://github.com/shadcn-ui/ui/issues/414#issuecomment-1772421366
    <Tabs defaultValue={tabs[0]} className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2 h-fit gap-2 p-2">
        {tabs.map((tabValue) => (
          <TabsTrigger
            key={tabValue}
            className="p-2 border border-foreground/20"
            value={tabValue}>
            {/* @ts-expect-error Next-intl has odd typing I don't understand */}
            {t(tabValue)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="profile">
        <ProfileForm firstName={user.firstName} lastName={user.lastName} />
      </TabsContent>

      <TabsContent value="email">
        <ChangeEmailForm currentEmail={user.email} />
      </TabsContent>

      <TabsContent value="password">
        <UpdatePassword hasPassword={isPassworded} />
      </TabsContent>

      <TabsContent value="api_keys">
        {/* @ts-expect-error Error*/}
        <API_KeysForm api_keys={user.api_keys} />
      </TabsContent>
    </Tabs>
  )
}

export const dynamic = 'force-dynamic'
