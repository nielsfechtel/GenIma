import { auth } from '@web/src/auth'
import { ThemeProvider } from '@web/src/components/ThemeProvider'
import { Button } from '@web/src/components/ui/button'
import LogoutButton from '@web/src/components/ui/LogoutButton'
import ThemeSwitch from '@web/src/components/ui/ThemeSwitch'
import { Link } from 'lucide-react'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import Image from 'next/image'
import { Toaster } from 'sonner'
import './globals.css'
import LanguageSwitcher from '@web/src/components/ui/LanguageSwitcher'

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
  const user = session?.user

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="p-4 flex flex-row justify-between border-b">
              {session && (
                <ul className="flex flex-row gap-2 items-center text-xs">
                  <li>
                    accessToken: {session.accessToken.substring(0, 10)}...
                  </li>
                  <li>
                    You are {user?.firstName} {user?.lastName}
                  </li>
                  <li>Email: {user?.email}</li>
                  <li>Role: {user?.role}</li>
                  <li>
                    Tier: {user?.tier.name} {user?.tier.tokenLimit}
                  </li>
                  <li>API-T.: {user?.api_tokens}</li>
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
              <ThemeSwitch />
              <LanguageSwitcher />
            </header>
            <main>{children}</main>
          </ThemeProvider>
          <Toaster
            toastOptions={{
              unstyled: true,
              classNames: {
                error: 'bg-red-400',
                success: 'text-green-400',
                warning: 'text-yellow-400',
                info: 'bg-blue-400',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
