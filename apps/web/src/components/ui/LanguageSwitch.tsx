'use client'

import { Button } from '@web/src/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@web/src/components/ui/dropdown-menu'
import { SUPPORTED_LOCALES } from '@web/src/intl.config'
import { deleteCookie, setCookie } from 'cookies-next'
import { Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const languageOptions = SUPPORTED_LOCALES.concat('system')

export default function LanguageSwitch() {
  const [language, setLanguage] = React.useState('en')
  const router = useRouter()

  const t = useTranslations('LanguageSwitch')

  function changeLanguage(code: string) {
    if (code === 'system') {
      deleteCookie('locale')
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
                  // need to write it like this because TypeScript only accepted literal values 'de' or 'en' for the t-function;
                  // using t(lang) gave an error
                  lang === 'en'
                    ? t('en')
                    : lang === 'de'
                      ? t('de')
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
