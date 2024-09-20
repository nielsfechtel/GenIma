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
            <h1>
              useSession returns <strong>{JSON.stringify(session)}</strong>
            </h1>
          </header>
          <main> {children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
