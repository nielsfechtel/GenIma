import { NextResponse } from 'next/server'

export async function GET() {
  // "Explanation
  // To respect the differences in client-side and server-side navigation,
  // and to help ensure that developers do not build insecure Middleware,
  // Middleware can no longer produce a response body. This ensures that
  // Middleware is only used to rewrite, redirect, or modify the incoming
  // request (e.g. setting cookies)."
  // -> See https://nextjs.org/docs/messages/returning-response-body-in-middleware

  // So for now we simply redirect, although that doesn't quite do what I
  // wanted it to - staying on URL/api-docs and showing what the Nest-API
  // returned.
  // Seems like Next-API-routes are not the solution to this problem.
  return NextResponse.redirect(`${process.env.API_SERVER_URL}/api-docs`)
}
