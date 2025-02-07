'use client'

import { Progress } from '@web/src/components/ui/progress'
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
  const messageDisplayDuration = 5000

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (showMessages) {
      // @ts-expect-error Again, Next-intl typing errors
      const initialMessage = t(messageKeys[Math.floor(Math.random() * messageKeys.length)])
      setCurrentMessage(initialMessage)

      intervalId = setInterval(() => {
        // @ts-expect-error Again, Next-intl typing errors
        const newMessage = t(messageKeys[Math.floor(Math.random() * messageKeys.length)])
        setCurrentMessage(newMessage)
      }, messageDisplayDuration)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [showMessages])

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0
        }
        return prevProgress + 1
      })
    }, messageDisplayDuration / 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-12">
      {showMessages && (
        <div className="space-y-2">
          <p className="text-primary dark:text-foreground text-sm mb-4 text-center animate-pulse-subtle">
            {currentMessage}
          </p>
          <Progress value={progress} className="w-full opacity-20" />
        </div>
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
