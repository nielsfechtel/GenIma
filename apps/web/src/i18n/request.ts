import { DEFAULT_LOCALE, isSupportedLocale } from '@web/src/intl.config'
import { deleteCookie } from 'cookies-next'
import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = cookies()
  const headersList = headers()

  // first, check if there's a cookie set
  let locale = cookieStore.get('locale')?.value

  if (!locale || !isSupportedLocale(locale)) {
    // if for some reason the cookie is set to an invalid locale,
    // let's delete it
    deleteCookie('locale')

    locale = headersList.get('accept-language')?.split('-')[0]

    if (!locale || !isSupportedLocale(locale)) {
      locale = DEFAULT_LOCALE
    }
  }

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
  }
})
