'use client'

import { executeToken } from '@web/src/actions/auth.actions'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

export default function Verify() {
  const t = useTranslations('verify')

  let message
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (token) {
    signOut({
      callbackUrl: '/',
      redirect: true,
    }).then(() => {
      executeToken(token)
        .then((result) => {
          message = result?.message
        })
        .catch((result) => {
          console.error("Something wen't wrong, please try again", result)
        })
    })
  } else {
    message = 'No token supplied!'
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{message}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <h2>{t('verifying')}</h2>
      </CardContent>
    </Card>
  )
}
