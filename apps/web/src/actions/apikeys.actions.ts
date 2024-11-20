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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}

export const getUserAPIKeys = async () => {
  try {
    return await trpc.user.getAPIKeys.query()
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}

export const deleteAPIKey = async (value: string) => {
  try {
    await trpc.user.deleteAPIKey.mutate({ value })
    revalidatePath('/settings')
    return {
      success: true,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}
