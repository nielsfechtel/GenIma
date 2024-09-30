'use client'

import { deleteImage } from '@web/src/actions/image.actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@web/src/components/ui/alert-dialog'
import { Badge } from '@web/src/components/ui/badge'
import { Button } from '@web/src/components/ui/button'
import { Card, CardContent } from '@web/src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@web/src/components/ui/dialog'
import { Trash2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ImageDataObjectProps {
  _id: string
  creatorId: string
  image_url: string
  firstName: string
  categories: string
  inputText: string
  prompt: string
  smallImageDimension: number
  createdAt: Date
  enableLink: boolean
  showDeleteButton: boolean
}

export default function ImageComponent({
  _id,
  creatorId,
  image_url,
  createdAt,
  firstName,
  prompt,
  categories,
  smallImageDimension,
  inputText,
  enableLink = false,
  showDeleteButton = false,
}: ImageDataObjectProps) {
  const t = useTranslations('ImageComponent')
  const locale = useLocale()

  const { data: user } = useSession()

  const [inputIsExpanded, setInputIsExpanded] = useState(false)
  const [promptIsExpanded, setPromptIsExpanded] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const CreatedByComponent = () => {
    const content = ` ${user?.user.firstName === firstName ? t('you') : firstName}`
    return enableLink ? (
      <Link href={`/image/${_id}`}>
        {t('created-by')} <span className="italic">{content}</span>
      </Link>
    ) : (
      content
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-foreground/20">
      <CardContent className="p-4 flex flex-col">
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer relative w-full aspect-video pb-2">
              <Image
                src={image_url}
                alt="User uploaded image"
                width={smallImageDimension}
                height={smallImageDimension}
                className="rounded-md"
              />
              <div className="text-sm text-gray-600 flex justify-between py-2">
                <span>{CreatedByComponent()}</span>
                <span>{new Date(createdAt).toLocaleDateString(locale)}</span>
              </div>
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

        <div className="flex flex-wrap gap-2">
          {categories.split(', ').map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        <div className="py-4 border-b border-foreground/10">
          <h2 className="text-sm font-semibold">{t('input-text')}:</h2>
          <p
            onClick={() => setInputIsExpanded(true)}
            className={`text-sm ${inputIsExpanded ? '' : 'line-clamp-3'}`}>
            {`"${inputText}"`}
          </p>
          {inputText.length > 150 && (
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => setInputIsExpanded(!inputIsExpanded)}>
              {inputIsExpanded ? t('show-less') : t('show-more')}
            </Button>
          )}
        </div>
        <div className="py-4">
          <h2 className="text-sm font-semibold">{t('generated-prompt')}</h2>
          <p
            onClick={() => setPromptIsExpanded(true)}
            className={`text-sm ${promptIsExpanded ? '' : 'line-clamp-3'}`}>
            {`"${prompt}"`}
          </p>
          {inputText.length > 150 && (
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => setPromptIsExpanded(!promptIsExpanded)}>
              {promptIsExpanded ? t('show-less') : t('show-more')}
            </Button>
          )}
        </div>

        {showDeleteButton && user?.user?._id.toString() === creatorId && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="py-4">
                <Button variant="destructive_lighter">
                  <Trash2Icon className="w-5 h-5" />
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('are-you-sure-you-want-to-delete-the-image')}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    deleteImage(_id)
                  }}
                  className="bg-destructive text-destructive-foreground">
                  {t('delete-image')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  )
}
