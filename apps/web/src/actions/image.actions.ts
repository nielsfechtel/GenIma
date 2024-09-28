'use server'

import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { trpc } from '@web/src/trpc'
import { revalidatePath } from 'next/cache'
import z from 'zod'

export const createNewImage = async ({
  inputText,
  inputOptions,
}: z.infer<typeof CreateImageSchema>) => {
  try {
    const result = await trpc.generatedImage.createImage.mutate({
      inputText,
      inputOptions,
    })
    revalidatePath('/')
    return {
      success: true,
      result,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}
