import en from './src/messages/en.json'

/*
    Next-Intl TypeScript setup (for autocompletion)
    Docs-link https://next-intl-docs.vercel.app/docs/workflows/typescript
*/
export type Messages = typeof en

declare global {
  interface ProcessEnv {
    API_SERVER_URL: string
    AUTH_SECRET: string
    AUTH_GOOGLE_ID: string
    AUTH_GOOGLE_SECRET: string
  }

  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
