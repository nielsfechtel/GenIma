'use client'

import enMessages from '@web/src/messages/en.json'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface LoadingProps {
  showMessages?: boolean
}

export default function LoadingAnim({ showMessages = false }: LoadingProps) {
  const t = useTranslations('404page')
  const messageKeys = Object.keys(enMessages['404page']).filter(
    (key) => !key.includes('_image_url')
  )

  const [currentMessage, setCurrentMessage] = useState('')

  useEffect(() => {
    if (showMessages) {
      const key = messageKeys[Math.floor(Math.random() * messageKeys.length)]

      setCurrentMessage(
        t(messageKeys[Math.floor(Math.random() * messageKeys.length)])
      )

      const intervalId = setInterval(() => {
        setCurrentMessage(
          t(messageKeys[Math.floor(Math.random() * messageKeys.length)])
        )
      }, 5500)

      return () => clearInterval(intervalId)
    }
  }, [showMessages, messageKeys])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {showMessages && (
        <p className="text-primary dark:text-foreground text-sm mb-4 text-center animate-pulse-subtle">
          {currentMessage}
        </p>
      )}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={
              'w-4 h-4 bg-primary dark:bg-foreground/90 rounded-full animate-pulse'
            }
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
