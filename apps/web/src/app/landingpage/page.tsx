import { Button } from '@web/src/components/ui/button'
import { Card, CardContent } from '@web/src/components/ui/card'
import { Image as ImageIcon, Sparkles, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6" />
          <span className="font-bold text-xl">AI ImageCraft</span>
        </Link>
        <div className="space-x-2">
          <Button variant="outline">Login</Button>
          <Button>Sign Up</Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Create Amazing Images with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            No technical knowledge required. Just describe, and we&apos;ll
            generate.
          </p>
          <Button size="lg">Get Started</Button>
        </section>

        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <CardContent className="flex flex-col items-center p-4">
                  <ImageIcon className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="text-lg font-semibold mb-1">
                    Easy Image Generation
                  </h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Describe your idea, and watch AI bring it to life.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="flex flex-col items-center p-4">
                  <Zap className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="text-lg font-semibold mb-1">Lightning Fast</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Get your images in seconds, not hours.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="flex flex-col items-center p-4">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="text-lg font-semibold mb-1">For Everyone</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    No technical skills needed. Perfect for all creators.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              See It in Action
            </h2>
            <div className="relative h-[400px] w-full max-w-[600px] mx-auto overflow-hidden rounded-lg shadow-lg">
              {slides.map((slide, index) => (
                <Image
                  key={index}
                  src={slide}
                  alt={`AI generated image ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background py-6 text-center">
        <p className="text-muted-foreground">
          &copy; 2023 AI ImageCraft. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
