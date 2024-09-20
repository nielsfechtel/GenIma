import { signOut } from '@web/src/auth'

export default async function Home() {
  return (
    <>
      <h1>Welcome to the Graduation Project!</h1>
      <h3>this is supposed to be protected.</h3>
      <form
        action={async () => {
          'use server'
          await signOut({
            redirectTo: '/login',
          })
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </>
  )
}
