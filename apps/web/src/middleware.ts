import { NextRequest, NextResponse } from "next/server";

/*
As https://nextjs.org/docs/pages/building-your-application/routing/internationalization
instruct, this middleware ensures that any links without a defined locale are redirected
to the defaultLocale defined in next.config.mjs
*/
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }
  if (req.nextUrl.locale === "default") {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
    return NextResponse.redirect(
      new URL(
        `/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`,
        req.url,
      ),
    );
  }
}
