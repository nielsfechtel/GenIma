'use client'

import { signIn } from '@web/src/auth'

const loginInitialState = {
  message: '',
  errors: {
    email: '',
    password: '',
    credentials: '',
    unknown: '',
  },
}

const SignInForm = () => {
  return (
    <form
      action={async (formData) => {
        'use server'
        await signIn('credentials', formData)
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">In</button>
    </form>
  )
}

export default SignInForm
