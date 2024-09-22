"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ImageIcon, UserIcon } from "lucide-react"

export function ImageDashboard() {
  const [showAllImages, setShowAllImages] = useState(false)

  const userImages = [
    { id: 1, src: "/placeholder.svg?height=200&width=200", alt: "User generated image 1" },
    { id: 2, src: "/placeholder.svg?height=200&width=200", alt: "User generated image 2" },
    { id: 3, src: "/placeholder.svg?height=200&width=200", alt: "User generated image 3" },
  ]

  const allImages = [
    ...userImages,
    { id: 4, src: "/placeholder.svg?height=200&width=200", alt: "Other user's image 1" },
    { id: 5, src: "/placeholder.svg?height=200&width=200", alt: "Other user's image 2" },
    { id: 6, src: "/placeholder.svg?height=200&width=200", alt: "Other user's image 3" },
  ]

  const displayedImages = showAllImages ? allImages : userImages

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome, Jane Doe</h1>
            <p className="text-muted-foreground">Your AI Image Dashboard</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium">My Images</span>
          <Switch
            checked={showAllImages}
            onCheckedChange={setShowAllImages}
            className="mr-2"
          />
          <span className="text-sm font-medium">All Images</span>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
        {displayedImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by generating some images.</p>
            <div className="mt-6">
              <Button>Generate New Image</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}