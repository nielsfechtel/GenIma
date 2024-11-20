'use server'

import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { trpc } from '@web/src/trpc'
import mongoose from 'mongoose'
import { notFound, redirect } from 'next/navigation'
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
  if (result) redirect(`/image/${result._id}`)
}

export const fetchAllImages = async () => {
  return await trpc.generatedImage.getAllImages.query()
}

export const fetchImageById = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) notFound()
  const result = await trpc.generatedImage.getImageById.query({ id })

  if (!result) {
    notFound()
  }
  return result
}

export const deleteImage = async (id: string) => {
  await trpc.generatedImage.deleteImageById.mutate({ id })
  redirect('/dashboard')
}
