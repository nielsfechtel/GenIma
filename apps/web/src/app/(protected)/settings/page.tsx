import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { hasPassword } from '@web/actions/auth.actions'
import API_KeysForm from '@web/src/app/(protected)/settings/_components/API_KeysForm'
import ChangeEmailForm from '@web/src/app/(protected)/settings/_components/ChangeEmailForm'
import DeleteAccountAlert from '@web/src/app/(protected)/settings/_components/DeleteAccountAlert'
import { ProfileForm } from '@web/src/app/(protected)/settings/_components/ProfileForm'
import { UpdatePassword } from '@web/src/app/(protected)/settings/_components/UpdatePassword'

export default async function SettingsPage() {
  const isPassworded = await hasPassword()

  return (
    <Tabs defaultValue="profile" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="changeEmail">Email</TabsTrigger>
        <TabsTrigger value="updatePassword">Password</TabsTrigger>
        <TabsTrigger value="deleteAccount">Delete Account</TabsTrigger>
        <TabsTrigger value="api_keys">API Keys</TabsTrigger>
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

      <TabsContent value="deleteAccount">
        <DeleteAccountAlert />
      </TabsContent>

      <TabsContent value="api_keys">
        <API_KeysForm />
      </TabsContent>
    </Tabs>
  )
}
