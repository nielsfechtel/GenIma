import { fetchAllImages } from '@web/src/actions/image.actions'
import ImageComponent from '@web/src/app/(protected)/image/_components/ImageComponent'
import { Button } from '@web/src/components/ui/button'
import { ImageIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function Component() {
  const images = await fetchAllImages()
  const t = await getTranslations('Dashboard')

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl font-bold">{t('welcome')}!</h1>
            <p className="text-muted-foreground">{t('view-all-images')}:</p>
          </div>
        </div>
      </header>
      <main className="space-y-8">
        <Link href="/image/create">
          <Button>{t('create-image')}</Button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, key) => (
            <ImageComponent
              key={key}
              firstName={image.creator.firstName}
              {...image}
              enableLink
            />
          ))}
        </div>
        {images.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {t('no-images')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{t('get-started')}</p>
            <div className="mt-6">
              <Link href="/image/create">
                <Button>{t('create-image')}</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
