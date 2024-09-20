import { trpc } from '@web/src/app/trpc'
import NextAuth from 'next-auth'
import { Provider } from 'next-auth/providers'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'email', type: 'text' },
      password: { label: 'password', type: 'password' },
    },
    /*
    So in the docs it says:
    "If you’re using TypeScript, you can augment the User interface to match the response of your authorize
    callback, so whenever you read the user in other callbacks (like the jwt) the type will match correctly."
    (in https://authjs.dev/getting-started/authentication/credentials)
    And the return in auth.service.ts is this:
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_KEY,
      }),
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }
      */
    async authorize(credentials) {
      const user = await trpc.auth.login.query({
        email: credentials.email,
        password: credentials.password,
      })

      return user
    },
  }),
  Google,
]

// this is used in the /login-page to list all non-credential login-providers
export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== 'credentials')

export const { auth, signIn, signOut, handlers } = NextAuth({
  // this is to make it work when using Docker, fails otherwise
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  providers,
  // so to understand this; these allow custom handling of signIn and session events
  // If I understand this correctly, I need to make it work with both credentials-signin and the other methods (for now, only Google)
  // The flow is as such: The user chooses to login with either credentials or Google. For credentials, the authorize-function above handles it (calling DB),
  // for Google, Google's Auth-setup handles it (via redirects).
  // -> SignIn-callback here (can return false to reject login, e.g. based on rejected email-domain)
  // - - -> is this also called when authorization fails based on server-response (our own or Google)? Yes, right, with an error?
  // If we fail: ??
  // If we succeed: we get back from Credentials: from Google: (profile is set when using ANY OAuth-provider? What is account, user, email?, token)
  // what is the JWT-callback for?
  // the session-callback should update the information. It is run (every time a page is accessed?) so no calling DB there, right?
  // is this related to the cookies
  // what do we WANT in the session? Let's say for now only email. Should the token be in there? In actual token-format?

  // the docs say If you want to pass data such as an Access Token or User ID to the browser when using JSON Web Tokens, you can persist the data in the token when the jwt callback is called, then pass the data through to the browser in the session callback.

  callbacks: {
    // interestingly, this signIn-callback below is called BEFORE our server-action in login/page.tsx
    // actually catches the thrown error. Assuming we return false/throw an error in here.
    // So we can check out the error and yeah idk
    // from the docs https://next-auth.js.org/configuration/callbacks#sign-in-callback:
    // When using the Credentials Provider the user object is the response returned from the
    // authorize callback and the profile object is the raw body of the HTTP POST submission.
    async signIn({ user, account, profile, email, credentials }) {
      console.log('in callback signIn, the values are', {
        user,
        account,
        profile,
        email,
        credentials,
      })
      // If it was a Google-signin, check if the user has signed up - if not, reject signin with custom error
      // Later we might add signing up via OAuth as well.
      if (account?.provider === 'google') {
        //check if user is in your database
        const foundUser = await trpc.user.getOneByEmail.query({
          // we know google provides this field
          email: user.email!,
        })
        console.log('in signin, foundUser is', foundUser)

        if (!foundUser) {
          // Docs: Redirects returned by this callback cancel the authentication flow.
          // Only redirect to error pages that, for example, tell the user why they're not allowed to sign in.
          // Note: this is the custom-error-page /error as designated in auth.ts' pages-setting
          return `/error?error=OAuth_User_Not_Found`
        }
      }

      return true
    },
    jwt({ token, user, profile, account }) {
      // user is what we got back from the backend
      // token is what we want to now set based on 'user'
      console.log('in callback jwt, the values are:', {
        token,
        user,
        profile,
        account,
      })

      const newReturn = { user: {}, accessToken: '' }
      if (user) {
        // GOOGLE also provides the full name and their id - but we have our own values for that so we don't want them
        newReturn.user = {
          email: user.email,
        }
        // GOOGLE provides an access_token in account yeah?
        // note we spell it without underscore here
        newReturn.accessToken = account!.access_token

        // here we simply expand the token
        return {
          ...token,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      }
      console.log(
        'inu jwt-callback, user was false, so we return base-token which is',
        token
      )
      return token
    },
    // setting the session's user to what we got from the token (see function above!)
    session({ session, token }) {
      console.log('in callback session, the values are:', { session, token })

      // simply expanding the session.user-object
      return {
        ...session,
        user: {
          ...session.user,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
        },
      }
    },
  },
})
