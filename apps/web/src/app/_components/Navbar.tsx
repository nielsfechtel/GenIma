import { auth } from '@web/src/auth'
import { Button } from '@web/src/components/ui/button'
import LanguageSwitch from '@web/src/components/ui/LanguageSwitch'
import LogoutButton from '@web/src/components/ui/LogoutButton'
import ThemeSwitch from '@web/src/components/ui/ThemeSwitch'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function Navbar() {
  const session = await auth()
  const user = session?.user
  const t = await getTranslations('Navbar')

  return (
    <header className="p-4 flex flex-row justify-between border-b">
      {session && <span>{`${t('hello')} ${user?.firstName}!`}</span>}
      <div>
        {session ? (
          <LogoutButton />
        ) : (
          <Button>
            <Link href="/login">{t('login')}</Link>
          </Button>
        )}
      </div>
      {session &&
        (user?.profileImage ? (
          <Image
            alt="Profile image of user"
            src={user?.profileImage}
            width={100}
            height={100}
          ></Image>
        ) : (
          <Link className="underline" href="/settings">
            <Button>{t('settings')}</Button>
          </Link>
        ))}
      <div className="space-x-2 ml-auto">
        <ThemeSwitch />
        <LanguageSwitch />
      </div>
    </header>
  )
}
