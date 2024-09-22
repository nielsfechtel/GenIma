import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { hasPassword } from '@web/actions/auth.actions'
import ChangeEmailForm from '@web/src/app/(protected)/settings/_components/ChangeEmailForm'
import DeleteAccountAlert from '@web/src/app/(protected)/settings/_components/DeleteAccountAlert'
import { UpdatePassword } from '@web/src/app/(protected)/settings/_components/UpdatePassword'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'

export default async function SettingsPage() {
  const isPassworded = await hasPassword()
  console.log('isPassworded:', isPassworded)

  return (
    <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-1 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="api_keys">API keys</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="space-y-8">
          <ChangeEmailForm />
          <UpdatePassword hasPassword={isPassworded} />
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <DeleteAccountAlert />
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="api_keys">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>API keys</CardTitle>
              <CardDescription>
                Generate API keys to query the backend.
              </CardDescription>
            </CardHeader>
            <CardFooter>a list of API keys</CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
