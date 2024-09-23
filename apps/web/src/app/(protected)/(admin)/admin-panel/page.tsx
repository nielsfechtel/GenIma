import { useTranslations } from 'next-intl'

export default function AdminPanel() {
  const t = useTranslations('AdminPanel')
  return (
    <h1 className="font-bold text-3xl mx-auto p-24">
      {t('super-secret-admin-panel')}
    </h1>
  )
}
