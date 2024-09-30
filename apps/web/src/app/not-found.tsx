import { Button } from '@web/src/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/src/components/ui/card'
import enMessages from '@web/src/messages/en.json'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

const errorMessages = enMessages['404page']

export default async function NotFound() {
  const t = await getTranslations('404page')
  const errorKeys = Object.keys(enMessages['404page']).filter(
    (key) => !key.includes('_image_url')
  )

  const randomKey = errorKeys[Math.floor(Math.random() * errorKeys.length)]
  const randomErrorMessage = errorMessages[randomKey]
  const randomErrorImageUrl = errorMessages[randomKey + '_image_url']

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          {t('404-page-not-found')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 flex-col items-center">
        <Image
          src={randomErrorImageUrl}
          width={300}
          height={300}
          alt="404 error illustration"
          priority
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard">{t('return-to-gallery')}</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/image/create">{t('generate-new-image')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
