'use server'

import { signIn } from 'next-auth/react'

export const handlecredentialsignin = async (formdata) => {
  try {
    const res = await signIn('credentials', formdata, {
      redirectto: '/',
    })

    console.log('in the res thing here, returning success true! res is', res)
    return {
      success: true,
    }
  } catch (error: unknown) {
    console.error(
      '(credentials) in error of handlecredentialsignin, the error-meesage is',
      error.message
    )
    console.error('the error-type is', error.type)
    console.error('the full error is', error)

    // if (error instanceof autherror) {
    //   switch (error.type) {
    //     case 'credentialssignin':
    //       return 'invalid credentials.'
    //     default:
    //       return 'something went wrong.'
    //   }
    // }

    // if (error.cause === trpcclienterror) {
    //   console.error(
    //     'heyo return redirect(`${signin_error_url}?error=${error.type}`)'
    //   )
    // }
    // console.log('error-message is', error.message)

    return {
      success: false,
      message: error.message,
    }
  }
}
