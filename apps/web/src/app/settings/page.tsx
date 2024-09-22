'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { EmailForm } from '@web/src/app/settings/_components/EmailForm'
import { PasswordForm } from '@web/src/app/settings/_components/PasswordForm'
import { ProfileForm } from '@web/src/app/settings/_components/ProfileForm'
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@web/src/components/ui/alert-dialog'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import { useState } from 'react'

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState(
    '/placeholder.svg?height=100&width=100'
  )

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfileImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-1 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="api_keys">API keys</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="space-y-8">
          <ProfileForm
            onImageUpload={handleImageUpload}
            profileImage={profileImage}
          />
          <EmailForm />
          <PasswordForm />
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will receive an email with a link to verify your
                      account&apos; deletion.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground">
                      Send verification email
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
