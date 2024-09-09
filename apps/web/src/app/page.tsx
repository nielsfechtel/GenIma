import { trpc } from '@web/src/app/trpc'
import { useTranslations } from 'next-intl'

export default async function Home() {
  const { greeting } = await trpc.hello.query({ name: `Tom` })
  const t = useTranslations('HomePage')

  return (
    <>
      <h1>{greeting}</h1>
      <h3>{t('title')}</h3>
      <h3>{t('about')}</h3>
    </>
  )
}
