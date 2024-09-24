import Navbar from '@web/src/app/_components/Navbar'
import { auth } from '@web/src/auth'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
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
  // Receive messages provided in `i18n/request.ts`
  const messages = await getMessages()
  const locale = await getLocale()

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
    <html lang={locale} suppressHydrationWarning className="h-full">
      <body
        suppressHydrationWarning
        className="h-full bg-background text-foreground"
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <Navbar />
              <main className="p-4 h-full flex items-center flex-col">{children}</main>
              <Toaster
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    error: 'space-y-2 shadow p-4 rounded bg-red-400',
                    success: 'space-y-2 shadow p-4 rounded text-green-400',
                    warning: 'space-y-2 shadow p-4 rounded text-yellow-400',
                    info: 'space-y-2 shadow p-4 rounded bg-blue-400',
                  },
                }}
              />
            </NextIntlClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
