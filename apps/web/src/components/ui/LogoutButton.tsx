import { signOut } from '@web/src/auth'
import { Button } from '@web/src/components/ui/button'

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({
          redirectTo: '/landingpage',
        })
      }}
    >
      <Button type="submit">Sign out</Button>
    </form>
  )
}
