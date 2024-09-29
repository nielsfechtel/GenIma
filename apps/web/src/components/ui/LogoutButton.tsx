'use client'

import { Button } from '@web/src/components/ui/button'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function LogoutButton() {
  const t = useTranslations('LogoutButton')

  return (
    <Button
      onClick={() => {
        signOut({ redirect: true, callbackUrl: '/landingpage' })
      }}
      type="submit">
      {t('logout')}
    </Button>
  )
}
