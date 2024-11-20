'use server'

import { SignUpSchema } from '@api/schemas/signup.schema'
import { signIn } from '@web/src/auth'
import { trpc } from '@web/src/trpc'
import { SignInOptions } from 'next-auth/react'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

export const handleSignup = async (formData: z.infer<typeof SignUpSchema>) => {
  try {
    await trpc.auth.signUp.mutate(formData)
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

export const sendDeleteAccountEmail = async () => {
  try {
    trpc.auth.deleteAccount.query()
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

export const executeToken = async (token: string) => {
  try {
    return trpc.auth.executeToken.mutate({ token })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}

// this appears to be necessary, as the signIn that is recommended to be used in client-components,
// imported from next-auth/react, somehow deletes the error-codes. So I need to provide my own, which
// just throws them forward, as you'd expect
export const myOwnServerSideSignIn = async (options: SignInOptions) => {
  try {
    await signIn('credentials', options)
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

export const updatePassword = async (
  oldPassword: string | '',
  newPassword: string
) => {
  try {
    await trpc.auth.changePassword.mutate({
      oldPassword,
      newPassword,
    })
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

export const hasPassword = async () => {
  return await trpc.user.hasPassword.query()
}
