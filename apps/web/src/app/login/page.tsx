import { TRPCClientError } from '@trpc/client'
import { providerMap, signIn } from '@web/src/auth'
import { error } from 'console'
import { AuthError } from 'next-auth'

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const handleCredentialSignin = async (formData) => {
    'use server'
    try {
      console.log('in handleCredentialSignin')
      console.log('formData is', formData)

      const res = await signIn('credentials', formData, {
        redirectTo: '/',
      })

      console.log('in the res thing here.')

      if (res?.status == 200) {
        console.log('is 200')
      } else if (res?.error) {
        console.error('an  error', error)
      } else {
        console.error('2an  error', error)
      }
    } catch (error: unknown) {
      console.log('FULL STRINGI ERROR IS', JSON.stringify(error))
      console.log('HEYA ERROR IS', error)
      console.log('OF TYPE', typeof error)

      console.log('error.cause is', error.cause)

      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.'
          default:
            return 'Something went wrong.'
        }
      }
      throw error

      if (error.cause === TRPCClientError) {
        console.error(
          'HEYO return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)'
        )
      }
      console.log('error-message is', error.message)

      return {
        success: false,
        message: error.message,
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form action={handleCredentialSignin}>
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
          action={async () => {
            'use server'
            await signIn(provider.id, {
              // when trying to access a protected page without being logged in,
              // the automatic redirect to /login happens, with the callbackUrl set to
              // whatever page was originally accessed. This way, we can redirect upon
              // successful authentication. Nice.
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
