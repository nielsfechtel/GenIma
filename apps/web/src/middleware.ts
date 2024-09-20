// as per the authjs-docs:
// "Add optional Middleware to keep the session alive, this will update the session expiry every time its called."
import { auth } from '@web/src/auth'

export default auth((req) => {
  // when not signed in, the users may access '/login' and '/error'
  // otherwise, they get redirect to '/login'
  const PUBLIC_ROUTES = ['/auth/login', '/auth/error']
  const ADMIN_ROUTES = ['/admin-panel']

  const isAuthed = !!req.auth
  const isAdmin = false
  const nextUrl = req.nextUrl

  // this says: is the array returned by some not empty? as Boolean
  // this is the case if the pathname starts with one of those routes
  const isPublicRoute = !!PUBLIC_ROUTES.some((path) =>
    nextUrl.pathname.startsWith(path)
  )
  const isAdminRoute = !!ADMIN_ROUTES.some((path) =>
    nextUrl.pathname.startsWith(path)
  )

  // if authenticated and trying to access a public route, redirect to '/'
  if (isPublicRoute && isAuthed) {
    return Response.redirect(new URL('/', req.url))
  }

  // if not authenticated and trying to access a private route
  if (!isAuthed && !isPublicRoute) {
    // setting callbackUrl here so /login's logic can return there after login
    return Response.redirect(
      new URL(`/login?callbackUrl=${nextUrl.pathname}`, req.url)
    )
  }

  // if authenticated, but not admin, and trying to access an admin-route
  // TODO update to include check if user is admin, see isAdmin above
  if (isAuthed && isAdminRoute && !isAdmin) {
    return Response.redirect(new URL('/', req.url))
  }
})

// from https://nextjs.org/docs/pages/building-your-application/routing/middleware#matching-paths
/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
