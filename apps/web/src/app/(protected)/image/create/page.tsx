'use client'

import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { createNewImage } from '@web/src/actions/image.actions'
import LoadingAnim from '@web/src/app/_components/LoadingAnim'
import { Button } from '@web/src/components/ui/button'
import { Checkbox } from '@web/src/components/ui/checkbox'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@web/src/components/ui/form'
import { Progress } from '@web/src/components/ui/progress'
import { Textarea } from '@web/src/components/ui/textarea'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const categories = Object.keys(CreateImageSchema.shape.inputOptions.shape)

type FormData = {
  description: string
  categories: string[]
}

export default function CreateImage() {
  const t = useTranslations('CreateImage')
  const t_categories = useTranslations('image-categories')

  /*
    So I wanted to have a 'Careful you have unsaved changes'-type-message, found this method https://stackoverflow.com/a/70841409/5272905
    However, it appears the App-router _still_ doesn't have events like routeChange (see below), and nothing equivalent (scroll to bottom):
    https://github.com/vercel/next.js/discussions/41934#discussioncomment-8996669
  */
  // const router = useRouter()
  // const [unsavedChanges, setUnsavedChanges] = useState(false)
  // const warningText = t(
  //   'you-have-unsaved-changes-are-you-sure-you-wish-to-leave-this-page'
  // )
  // useEffect(() => {
  //   const handleWindowClose = (e) => {
  //     if (!unsavedChanges) return
  //     e.preventDefault()
  //     return (e.returnValue = warningText)
  //   }
  //   const handleBrowseAway = () => {
  //     if (!unsavedChanges) return
  //     if (window.confirm(warningText)) return
  //     router.events.emit('routeChangeError')
  //     throw 'routeChange aborted.'
  //   }
  //   window.addEventListener('beforeunload', handleWindowClose)
  //   router.events.on('routeChangeStart', handleBrowseAway)
  //   return () => {
  //     window.removeEventListener('beforeunload', handleWindowClose)
  //     router.events.off('routeChangeStart', handleBrowseAway)
  //   }
  // }, [unsavedChanges])

  const [loadingImageCreation, setLoadingImageCreation] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const form = useForm<FormData>({
    defaultValues: {
      description: '',
      categories: [],
    },
  })

  const { control, watch } = form

  const description = watch('description')
  const selectedCategories = watch('categories')

  useEffect(() => {
    setCharCount(description?.length || 0)
  }, [description])

  const onSubmit = async (data: FormData) => {
    const transformedCategories: z.infer<
      typeof CreateImageSchema
    >['inputOptions'] = {
      'ASCII-art': data.categories.includes('ASCII-art'),
      'Copy art': data.categories.includes('Copy art'),
      Drawing: data.categories.includes('Drawing'),
      Dystopian: data.categories.includes('Dystopian'),
      Fantasy: data.categories.includes('Fantasy'),
      Futuristic: data.categories.includes('Futuristic'),
      Medieval: data.categories.includes('Medieval'),
      Nature: data.categories.includes('Nature'),
      Painting: data.categories.includes('Painting'),
      Photograph: data.categories.includes('Photograph'),
      Photorealistic: data.categories.includes('Photograph'),
      Prehistoric: data.categories.includes('Prehistoric'),
      Scifi: data.categories.includes('Scifi'),
      Sketch: data.categories.includes('Sketch'),
    }

    setLoadingImageCreation(true)
    await createNewImage({
      inputText: data.description,
      inputOptions: transformedCategories,
    })
  }

  return loadingImageCreation ? (
    <div className="w-96 h-96 grid place-content-center">
      <LoadingAnim />
    </div>
  ) : (
    <Form {...form}>
      <form
        // onChange={() => !unsavedChanges && setUnsavedChanges(true)}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-w-96 max-w-2xl mx-auto p-6 bg-background rounded-lg shadow-lg">
        <FormField
          control={control}
          name="description"
          rules={{
            required: t('text-is-required'),
            maxLength: {
              value: 1500,
              message: t('text-must-be-1500-characters-or-less'),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                {t('image-text')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'describe-the-image-you-want-to-generate-up-to-1500-characters'
                  )}
                  className="mt-1 h-40"
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-muted-foreground">
                  {charCount} / 1500 {t('characters')}
                </p>
                <Progress
                  value={(charCount / 1500) * 100}
                  className="w-1/2 opacity-40"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="categories"
          rules={{
            validate: (value) =>
              value.length <= 5 || 'You can select up to 5 categories',
          }}
          render={() => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                {t('categories-select-up-to-5')}
              </FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 pt-1 lg:grid-cols-4 gap-4 mt-2">
                {categories.map((category) => (
                  <FormField
                    key={category}
                    control={control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 select-none">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category
                                      )
                                    )
                              }}
                              disabled={
                                !field.value?.includes(category) &&
                                field.value?.length >= 5
                              }
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {t_categories(category)}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground pt-4">
                {selectedCategories.length} / 5 {t('categories-selected')}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t('generate-image')}
        </Button>
      </form>
    </Form>
  )
}
