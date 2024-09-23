export const SUPPORTED_LOCALES = ['en', 'de']
export const isSupportedLocale = (locale: string | '') =>
  SUPPORTED_LOCALES.includes(locale)
export const DEFAULT_LOCALE = 'en'
