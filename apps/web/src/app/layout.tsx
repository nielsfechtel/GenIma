import { auth } from '@web/src/auth'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
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
          <main> {children}</main>
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
