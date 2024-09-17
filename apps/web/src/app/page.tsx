import SignInForm from '@web/src/components/testLoginForm'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('HomePage')

  return (
    <>
      <h1>{t('title')}</h1>
      <h3>{t('login')}:</h3>
      <SignInForm />
    </>
  )
}
