import en from './messages/en.json'

/*
    Next-Intl TypeScript setup (for autocompletion)
    Docs-link https://next-intl-docs.vercel.app/docs/workflows/typescript
*/
type Messages = typeof en

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
