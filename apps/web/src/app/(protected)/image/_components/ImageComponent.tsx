'use client'

import { Badge } from '@web/src/components/ui/badge'
import { Button } from '@web/src/components/ui/button'
import { Card, CardContent } from '@web/src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@web/src/components/ui/dialog'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ImageDataObjectProps {
  _id: string
  image_url: string
  firstName: string
  categories: string
  inputText: string
  enableLink: boolean
}

export default function ImageComponent({
  _id,
  image_url,
  firstName,
  categories,
  inputText,
  enableLink = false,
}: ImageDataObjectProps) {
  const t = useTranslations('ImageComponent')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const CreatedByComponent = () => {
    const content = t('created-by') + ` ${firstName}`
    return enableLink ? <Link href={`/image/${_id}`}>{content}</Link> : content
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer relative w-full aspect-video">
              <Image
                src={image_url}
                alt="User uploaded image"
                width={500}
                height={500}
                className="rounded-md"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full p-0">
            <Image
              src={image_url}
              alt="User uploaded image"
              width={1024}
              height={1024}
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>

        <p className="mt-2 text-sm text-gray-600">{CreatedByComponent()}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {categories.split(', ').map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        <div className="mt-4">
          <h2 className="text-sm font-semibold">{t('input-text')}:</h2>
          <p className={`text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
            {`"${inputText}"`}
          </p>
          {inputText.length > 150 && (
            <Button
              variant="link"
              className="mt-2 p-0 h-auto"
              onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('show-less') : t('show-more')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
