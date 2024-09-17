// as per the authjs-docs:
// "Add optional Middleware to keep the session alive, this will update the session expiry every time its called."
import { auth } from '@web/src/auth'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    /* Protected route-like code from somewhere else */
    //   const isAuthenticated = !!req.auth
    //   const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

    //   if (isPublicRoute && isAuthenticated)
    //     return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))

    //   if (!isAuthenticated && !isPublicRoute)
    //     return Response.redirect(new URL(ROOT, nextUrl))

    const newUrl = new URL('/login', req.nextUrl.origin)
    return Response.redirect(newUrl)
  } else if (req.auth && req.nextUrl.pathname === '/login') {
    // if trying to access /login while signed in, redirect to "/"
    const newUrl = new URL('/', req.nextUrl.origin)
    return Response.redirect(newUrl)
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
