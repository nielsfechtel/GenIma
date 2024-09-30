'use client'

import { Button } from '@web/src/components/ui/button'
import { Card, CardContent } from '@web/src/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@web/src/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { ImageIcon, Users, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

const previewImages = [
  'https://res.cloudinary.com/graduationproject/image/upload/v1727644596/g5rhlozbp8at5obhnorx.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727690479/i52utvw5hcki5b938627.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727644764/mlqui2gsft1hvpgswffp.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727644804/owxiyarb1sgujbnsv4e0.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727644853/sat8yl3zkxplyw65igyd.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727697287/lxh620ztku20qdml7lr1.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727698945/mgluwhsvjt4u1qlhfvhi.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727698604/wuwhfijl43kcm37hyixz.png',
  'https://res.cloudinary.com/graduationproject/image/upload/v1727697142/mktsxjlts803pdpuigyk.png',
]

export default function LandingPage() {
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }))

  const t = useTranslations('LandingPage')

  return (
    <main className="space-y-16">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">
          {t('create-amazing-images-with-ai')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('no-technical-knowledge-required')}
        </p>
        <Link href="/image/create">
          <Button size="lg">{t('get-started')}</Button>
        </Link>
      </section>

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="h-full">
              <CardContent className="flex flex-col items-center p-4">
                <ImageIcon className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-lg font-semibold mb-1">
                  {t('easy-image-generation')}
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  {t('describe-your-idea-and-watch-ai-bring-it-to-life')}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent className="flex flex-col items-center p-4">
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-lg font-semibold mb-1">
                  {t('lightning-fast')}
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  {t('get-your-images-in-seconds-not-hours')}
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent className="flex flex-col items-center p-4">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-lg font-semibold mb-1">
                  {t('get-started')}
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  {t('no-technical-skills-needed-perfect-for-all-creators')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('see-it-in-action')}
          </h2>
          <Carousel
            // https://www.embla-carousel.com/plugins/autoplay/
            plugins={[plugin.current]}
            className="w-full max-w-xl"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}>
            <CarouselContent>
              {previewImages.map((imageUrl, key) => (
                <CarouselItem key={key}>
                  <div className="w-full grid place-content-center">
                    <Image
                      src={imageUrl}
                      alt="Sample image"
                      width={450}
                      height={450}
                      className="rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </main>
  )
}
