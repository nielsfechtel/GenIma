// as per the authjs-docs:
// "Add optional Middleware to keep the session alive, this will update the session expiry every time its called."
import { auth } from '@web/src/auth'
import {
  adminRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from '@web/src/routes'
import { trpc } from '@web/src/trpc'

export default auth(async (req) => {
  const isAuthed = !!req.auth
  const { nextUrl } = req

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname)

  if (nextUrl.pathname === '/')
    return Response.redirect(new URL('/landingpage', nextUrl))
  if (nextUrl.pathname === '/login')
    return Response.redirect(new URL('/auth/login', nextUrl))
  if (nextUrl.pathname === '/signup')
    return Response.redirect(new URL('/auth/signup', nextUrl))

  if (isAuthRoute) {
    if (isAuthed && !nextUrl.pathname.startsWith('/auth/verify')) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  if (!isAuthed && !isPublicRoute) {
    // attach a callbackUrl so the user get's redirected to the page they originally wanted to access
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${nextUrl.pathname}`, nextUrl)
    )
  }

  if (isAdminRoute) {
    // can only request this if authed
    const isAdmin = isAuthed && (await trpc.user.isAdmin.query())
    if (!isAdmin)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  return null
})

/**
 * Any route matching this regex will pass, is public.
 * These are all api-routes, _next-routes, images and favicon
 * from https://nextjs.org/docs/pages/building-your-application/routing/middleware#matching-paths
 * @type {string}
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
}
