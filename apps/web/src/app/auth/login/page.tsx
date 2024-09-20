'use client'

import { providerMap, signIn } from '@web/src/auth'

export default function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const loginCredentials = async (formData) => {
    const result = await signIn('credentials', {
      formData,
      redirectTo: props.searchParams?.callbackUrl ?? '',
    })
    alert('hey')
    console.log('result is', result)
  }

  return (
    <div className="flex flex-col gap-2">
      <form action={loginCredentials}>
        <label htmlFor="email">
          Email
          <input name="email" id="email" />
        </label>
        <label htmlFor="password">
          Password
          <input name="password" id="password" />
        </label>
        <input type="submit" value="Sign In" />
      </form>
      {Object.values(providerMap).map((provider, key) => (
        <form
          key={key}
          action={() => {
            signIn(provider.name, {
              redirectTo: props.searchParams?.callbackUrl ?? '',
            })
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </div>
  )
}
