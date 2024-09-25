'use server'

import { trpc } from '@web/src/trpc'
import { revalidatePath } from 'next/cache'

export const createAPIKey = async (name: string, expiry_date: string) => {
  try {
    await trpc.user.addAPIKey.mutate({ name, expiry_date })
    revalidatePath('/settings')
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}
