'use server'

import { SignUpSchema } from '@api/zod_schemas/signup.schema'
import { signIn } from '@web/src/auth'
import { trpc } from '@web/src/trpc'
import * as z from 'zod'

export const handleSignup = async (formData: z.infer<typeof SignUpSchema>) => {
  try {
    await trpc.auth.signUp.mutate(formData)
    return {
      success: true,
    }
  } catch (error: unknown) {
    console.log('error in handleSignup', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

export const sendDeleteAccountEmail = async () => {
  try {
    return trpc.auth.deleteAccount.query()
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const executeToken = async (token: string) => {
  try {
    return trpc.auth.executeToken.mutate({ token })
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// this appears to be necessary, as the signIn that is recommended to be used in client-components,
// imported from next-auth/react, somehow deletes the error-codes. So I need to provide my own, which
// just throws them forward, as you'd expect
export const myOwnServerSideSignIn = async (options) => {
  return signIn('credentials', options)
}

export const updatePassword = async (
  oldPassword: string | '',
  newPassword: string
) => {
  try {
    return trpc.auth.changePassword.mutate({ oldPassword, newPassword })
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const hasPassword = async () => {
  return await trpc.auth.hasPassword.query()
}
