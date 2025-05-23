'use client'

import { Button } from '@web/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@web/src/components/ui/dropdown-menu'
import { SUPPORTED_LOCALES } from '@web/src/intl.config'
import { deleteCookie, setCookie } from 'cookies-next'
import { Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const languageOptions = SUPPORTED_LOCALES.concat('system')

export default function LanguageSwitch() {
  const currentLocale = useLocale()
  const [language, setLanguage] = React.useState(currentLocale)
  const router = useRouter()

  const t = useTranslations('LanguageSwitch')

  function changeLanguage(code: string) {
    if (code === 'system') {
      deleteCookie('locale')
      setLanguage(code)
      router.refresh()
    } else {
      setCookie('locale', code)
      setLanguage(code)
      router.refresh()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">{t('toggle-language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((lang) => {
          return (
            <DropdownMenuItem key={lang} onClick={() => changeLanguage(lang)}>
              <span className={language === lang ? 'font-bold' : ''}>
                {
                  // need to hardcode it like this because TypeScript only accepts literal values 'de' or 'en' for the t-function;
                  // using t(lang) gives an error
                  lang === 'en'
                    ? t('en')
                    : lang === 'de'
                    ? t('de')
                    : lang === 'ru'
                    ? t('ru')
                    : t('system')
                }
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
