'use client'

import { Button } from '@web/src/components/ui/button'
import LanguageSwitch from '@web/src/components/ui/LanguageSwitch'
import LogoutButton from '@web/src/components/ui/LogoutButton'
import ThemeSwitch from '@web/src/components/ui/ThemeSwitch'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations('Navbar')

  return (
    <header className="p-4 flex flex-row flex-wrap items-center justify-between border-b">
      <div className="flex flex-row gap-4 items-center">
        <Image
          src="/images/logos/TEMP_L1a.png"
          alt="Website logo"
          className="dark:invert"
          width={40}
          height={40}
        />
        {session ? (
          <Link href="/dashboard">
            <Button>{t('dashboard')}</Button>
          </Link>
        ) : (
          <Link href="/landingpage">
            <Button>{t('landingpage')}</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-row gap-4 items-center">
        {session && (
          <Link className="underline" href="/settings">
            <Button>{t('settings')}</Button>
          </Link>
        )}

        {session ? (
          <LogoutButton />
        ) : (
          <Button>
            <Link href="/login">{t('login')}</Link>
          </Button>
        )}

        <ThemeSwitch />
        <LanguageSwitch />
      </div>
    </header>
  )
}
