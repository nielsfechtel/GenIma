/*
As https://nextjs.org/docs/pages/building-your-application/routing/internationalization
instruct, this middleware ensures that any links without a defined locale are redirected
to the defaultLocale defined in next.config.mjs
*/
// const PUBLIC_FILE = /\.(.*)$/;

// export async function middleware(req: NextRequest) {
//   if (
//     req.nextUrl.pathname.startsWith("/_next") ||
//     req.nextUrl.pathname.includes("/api/") ||
//     PUBLIC_FILE.test(req.nextUrl.pathname)
//   ) {
//     return;
//   }
//   if (req.nextUrl.locale === "default") {
//     const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
//     return NextResponse.redirect(
//       new URL(
//         `/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`,
//         req.url,
//       ),
//     );
//   }
// }

// https://stackoverflow.com/questions/76519971/using-next-auth-next-intl-in-middleware-together
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from './lib/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req

  const isAuthenticated = !!req.auth
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

  if (isPublicRoute && isAuthenticated)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL(ROOT, nextUrl))
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
