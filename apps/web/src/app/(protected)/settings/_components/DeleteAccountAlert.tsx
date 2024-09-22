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
import { sendDeleteAccountEmail } from '@web/actions/auth.actions'
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@web/src/components/ui/alert-dialog'
import { Button } from '@web/src/components/ui/button'
import { toast } from 'sonner'

export default function DeleteAccountAlert() {
  const handleDeleteAccountMail = async () => {
    try {
      await sendDeleteAccountEmail()
      toast.success('Sent a verification-email!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will receive an email with a link to verify your account&apos;
            deletion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccountMail}
            className="bg-destructive text-destructive-foreground"
          >
            Send verification email
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
