'use client'

import ImageComponent from '@web/src/app/(protected)/image/_components/ImageComponent'
import { Label } from '@web/src/components/ui/label'
import { Switch } from '@web/src/components/ui/switch'
import { RouterOutputs } from '@web/src/trpc'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type ImagesType = RouterOutputs['generatedImage']['getAllImages']
interface ImageListProps {
  images: ImagesType
}

export default function ImageList({ images }: ImageListProps) {
  const t = useTranslations('ImageComponent')
  const { data: user } = useSession()
  const [showingImages, setShowingImages] = useState(images)
  const [showOnlyOwnImages, setShowOnlyOwnImages] = useState(false)

  const handleToggle = () => {
    setShowOnlyOwnImages(!showOnlyOwnImages)
  }

  useEffect(() => {
    if (showOnlyOwnImages) {
      setShowingImages(
        images.filter((image) => {
          if (typeof image.creator === 'string') {
            return user?.user?._id.toString() === image.creator
          }
          return user?.user?._id.toString() === image.creator._id
        })
      )
    } else {
      setShowingImages(images)
    }
  }, [showOnlyOwnImages, images, user?.user?._id])

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="image-view-mode"
          checked={showOnlyOwnImages}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="image-view-mode">
          {showOnlyOwnImages ? t('view-own-images') : t('view-all-images')}
        </Label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {showingImages.map((image, key) => (
          typeof image.creator !== "string" &&
            <ImageComponent
              key={key}
              smallImageDimension={500}
              firstName={image.creator.firstName}
              creatorId={image.creator._id}
              showDeleteButton={false}
              enableLink
              {...image}
              // wants a Date not a string
              createdAt={new Date(image.createdAt)}
            />
        ))}
      </div>
    </main>
  )
}
