'use server'

import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { trpc } from '@web/src/trpc'
import { redirect } from 'next/navigation'
import z from 'zod'

export const createNewImage = async ({
  inputText,
  inputOptions,
}: z.infer<typeof CreateImageSchema>) => {
  let result
  try {
    result = await trpc.generatedImage.createImage.mutate({
      inputText,
      inputOptions,
    })
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
  redirect(`/image/${result._id}`)
}

export const fetchAllImages = async () => {
  return await trpc.generatedImage.getAllImages.query()
}

export const fetchImageById = async (id: string) => {
  return await trpc.generatedImage.getImageById.query({ id })
}
