'use client'

import { Checkbox } from '@radix-ui/react-checkbox'
import { Label } from '@radix-ui/react-dropdown-menu'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Textarea } from '@web/src/components/ui/textarea'
import { useState } from 'react'
import { Button } from 'react-day-picker'

import { CreateImageSchema } from '@api/schemas/create-image.schema'

const categories = Object.keys(CreateImageSchema.shape.inputOptions.shape)

export function ImageCreationFormComponent() {
  const [textSnippet, setTextSnippet] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Text Snippet:', textSnippet)
    console.log('Selected Categories:', selectedCategories)
    // Here you would typically call your image generation API
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else if (prev.length < 5) {
        return [...prev, category]
      } else {
        return prev
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="space-y-2">
        <Label htmlFor="text-snippet">Text Snippet</Label>
        <Textarea
          id="text-snippet"
          value={textSnippet}
          onChange={(e) => setTextSnippet(e.target.value)}
          placeholder="Enter your text snippet here (up to 1500 characters)"
          required
          maxLength={1500}
          className="h-40"
        />
        <p className="text-sm text-muted-foreground">
          {textSnippet.length}/1500 characters
        </p>
      </div>
      <div className="space-y-2">
        <Label>Categories (Select up to 5)</Label>
        <p className="text-sm text-muted-foreground">
          {selectedCategories.length}/5 categories selected
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                disabled={
                  selectedCategories.length >= 5 &&
                  !selectedCategories.includes(category)
                }
              />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Categories</Label>
          <ScrollArea className="h-20 w-full rounded-md border">
            <div className="p-4">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm
                    mr-2 mb-2"
                >
                  {category}
                </span>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      <Button type="submit" className="w-full">
        Generate Image
      </Button>
    </form>
  )
}
