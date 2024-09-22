import { auth } from '@web/src/auth'
import { Button } from '@web/src/components/ui/button'
import LogoutButton from '@web/src/components/ui/LogoutButton'
import Image from 'next/image'
import Link from 'next/link'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user

  return (
    <>
      <header className="p-4 flex flex-row justify-between border-b">
        {session && (
          <ul className="flex flex-row gap-10 items-center">
            <li>
              accessToken (truncated): {session.accessToken.substring(0, 15)}
            </li>
            <li>
              You are {user?.firstName} {user?.lastName}
            </li>
            <li>Email: {user?.email}</li>
            <li>Role: {user?.role}</li>
          </ul>
        )}
        <div>
          {session ? (
            <LogoutButton />
          ) : (
            <Button>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
        {user?.profileImage ? (
          <Image
            alt="Profile image of user"
            src={user?.profileImage}
            width={100}
            height={100}
          ></Image>
        ) : (
          <Link className="underline" href="/settings">
            <Button>Settings</Button>
          </Link>
        )}
      </header>
      {children}
    </>
  )
}
