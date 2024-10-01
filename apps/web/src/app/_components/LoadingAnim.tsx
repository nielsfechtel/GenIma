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
  }, [])

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0
        }
        return prevProgress + 1
      })
    }, 55) // 55ms * 100 steps = 5500ms (5.5 seconds)

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
