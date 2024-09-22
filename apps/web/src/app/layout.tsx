import { auth } from '@web/src/auth'
import { Button } from '@web/src/components/ui/button'
import LogoutButton from '@web/src/components/ui/LogoutButton'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Niels Grad Project',
  description: 'Niels Grad Project generating images',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    // This serves to stop the "Warning: Extra attributes from the server: class" you get in the console.
    // It is usually caused by extensions, but also e.g. Next-plugins.
    // It's fine to use as the suppression goes only one level deep, as noted in the next-themes-docs:
    /*
      Note! If you do not add suppressHydrationWarning to your <html> you will get warnings because next-themes
      updates that element. This property only applies one level deep, so it won't block hydration warnings on
      other elements.
    */
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <header className="p-8">
            {session ? (
              <LogoutButton />
            ) : (
              <Button>
                <Link href="/login">Login</Link>
              </Button>
            )}
            <h1>
              {session && (
                <>
                  useSession returns <strong>{JSON.stringify(session)}</strong>
                </>
              )}
            </h1>
          </header>
          <main> {children}</main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
