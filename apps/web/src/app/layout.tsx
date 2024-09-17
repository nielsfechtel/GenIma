import { auth } from '@web/src/auth'
import { SessionProvider } from 'next-auth/react'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html>
      <body>
        <SessionProvider session={session}>
          <header>
            This is a header, displaying the information gotten from useSession:{' '}
            {JSON.stringify(session)}
          </header>
          <main> {children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
