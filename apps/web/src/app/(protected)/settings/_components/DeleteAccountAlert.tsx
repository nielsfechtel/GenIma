'use client'
import { sendDeleteAccountEmail } from '@web/src/actions/auth.actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@web/src/components/ui/alert-dialog'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export default function DeleteAccountAlert() {
  const t = useTranslations('DeleteAccountAlert')

  const handleDeleteAccountMail = async () => {
    const result = await sendDeleteAccountEmail()
    if (result.success) {
      toast.success(t('sent-a-verification-email'))
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('delete-account')}</CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">{t('delete-account')}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('are-you-absolutely-sure')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  'you-will-receive-an-email-with-a-link-to-verify-your-account-and-apos-deletion'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccountMail}
                className="bg-destructive text-destructive-foreground"
              >
                {t('send-verification-email')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
