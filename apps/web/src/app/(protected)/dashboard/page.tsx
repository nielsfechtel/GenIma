import { fetchAllImages } from '@web/src/actions/image.actions'
import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@web/src/components/ui/card'
import { ImageIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function Component() {
  const images = await fetchAllImages()
  const t = await getTranslations('Dashboard')

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl font-bold">{t('welcome')}</h1>
            <p className="text-muted-foreground">
              {t('your-ai-image-dashboard')}
            </p>
          </div>
        </div>
      </header>
      <main>
        <Link href="/create-image">
          <Button>{t('create-image')}</Button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, key) => (
            <Card key={key} className="overflow-hidden">
              <CardHeader>Image by X</CardHeader>
              <CardContent className="p-0">
                <Image
                  src={image.image_url}
                  alt={`Image of Categories or something`}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
              <CardFooter>Categories: YZ</CardFooter>
            </Card>
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
              <Button>{t('generate-new-image')}</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
