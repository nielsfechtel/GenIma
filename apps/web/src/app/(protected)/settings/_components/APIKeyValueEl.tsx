'use client'

import { Button } from '@web/src/components/ui/button'
import { AlertCircle, Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

interface APIKeyValueElProps {
  apiKey?: string
}
export default function APIKeyValueEl({ apiKey }: APIKeyValueElProps) {
  const [isCopied, setIsCopied] = useState(false)
  const t = useTranslations('APIKeyValueEl')

  const copyToClipboard = useCallback(() => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    }
  }, [apiKey])

  if (!apiKey) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-100 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-sm text-red-700">{t('not-defined')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
        <code className="text-sm font-mono truncate flex-1">{apiKey}</code>
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="icon"
          className="ml-2"
          aria-label="Copy to clipboard">
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isCopied && (
        <p className="text-sm text-green-500 mt-2">
          {t('copied-to-clipboard')}
        </p>
      )}
    </div>
  )
}
