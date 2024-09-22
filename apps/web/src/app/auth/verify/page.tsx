'use client'

import { executeToken } from '@web/actions/auth.actions'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export default function Verify() {
  let message
  let gotoLocation = 'dashboard'
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (token) {
    signOut({
      callbackUrl: '/',
      redirect: true,
    }).then(() => {
      executeToken(token)
        .then((result) => {
          console.log(`result is `, result)
          message = result.message
          switch (result.actionType) {
            case 'DELETE_ACCOUNT': {
              // this does not currently work - I think because it reloads the page.
              // might be best to just directly have the verify-links be a server-api-route - and then
              // redirect to a proper page, maybe with a ?message='..Email verified!' set that shows
              // a toast on the page it opens
              setTimeout(() => {
                toast.success('Account deleted!')
              }, 500)
              gotoLocation = 'landingpage'
              break
            }
            case 'RESET_PASSWORD': {
              setTimeout(() => {
                toast.success('Password reset!')
              }, 500)
              gotoLocation = 'dashboard'
              break
            }
            case 'VERIFY_EMAIL': {
              setTimeout(() => {
                toast.success('Email verified!')
              }, 500)
              gotoLocation = 'login'
              break
            }
            default: {
              gotoLocation = 'landingpage'
            }
          }
        })
        .catch((result) => {
          console.error("Something wen't wrong, please try again", result)
        })
    })
  } else {
    message = 'No token supplied!'
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{message}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {gotoLocation && (
          <Button>
            <Link href={`/${gotoLocation}`}>
              Go to <span className="underline">{gotoLocation}</span>
            </Link>
          </Button>
        )}
        <form>
          <h3>Update password here!</h3>
          <h5>
            This won&apos;t work, this is not a client-component. Redirect?
          </h5>
        </form>
      </CardContent>
    </Card>
  )
}
