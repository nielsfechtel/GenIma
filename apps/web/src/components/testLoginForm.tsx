'use client'

import { Button } from '@web/src/components/ui/button'
import { Input } from '@web/src/components/ui/input'
import { login } from '@web/src/lib/actions'
import { useFormState } from 'react-dom'

const loginInitialState = {
  message: '',
  errors: {
    email: '',
    password: '',
    credentials: '',
    unknown: '',
  },
}

const TestLoginForm = () => {
  const [formState, formAction] = useFormState(login, loginInitialState)

  return (
    <form action={formAction} className="space-y-4 w-full max-w-sm">
      <Input required name="email" placeholder="email" />
      <Input required name="password" type="password" placeholder="password" />
      <Button variant="secondary" className="w-full" type="submit">
        submit
      </Button>
    </form>
  )
}

export default TestLoginForm
