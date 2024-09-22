import { executeToken } from '@web/actions/auth.actions'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import Link from 'next/link'

export default async function Verify(props: {
  searchParams: { token: string }
}) {
  let message
  let gotoLocation = 'dashboard'

  const token = props.searchParams?.token
  if (token) {
    const result = await executeToken(props.searchParams.token)

    message = result.message
    switch (result.actionType) {
      case 'DELETE_ACCOUNT': {
        gotoLocation = 'landingpage'
        break
      }
      case 'RESET_PASSWORD': {
        gotoLocation = 'dashboard'
        break
      }
      case 'VERIFY_EMAIL': {
        gotoLocation = 'login'
        break
      }
      default: {
        gotoLocation = 'landingpage'
      }
    }
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
