'use server'

import { trpc } from '@web/src/trpc'
import { revalidatePath } from 'next/cache'

export const updateNames = async (firstName: string, lastName: string) => {
  try {
    await trpc.user.updateNames.mutate({ firstName, lastName })
    revalidatePath('')
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

export const updateEmail = async (newEmail: string) => {
  try {
    await trpc.auth.changeEmail.query({ newEmail })
    revalidatePath('')
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

export const getUser = async () => {
  return await trpc.user.getUser.query()
}

export const getAllUsers = async () => {
  return await trpc.user.getAll.query()
}

export const getAllTiers = async () => {
  return await trpc.user.getAllTiers.query()
}
