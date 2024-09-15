import { trpc } from '@web/src/app/trpc'
import TestLoginForm from '@web/src/components/testLoginForm'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const test = await trpc.auth.helloFromAuth.query()
  const { greeting } = await trpc.hello.query({ name: `Tom` })
  const t = await getTranslations('HomePage')

  return (
    <>
      <h1>{greeting}</h1>
      <h3>{t('title')}</h3>
      <h3>{t('about')}</h3>
      <TestLoginForm />
    </>
  )
}
