import { openai as openai_aisdk } from '@ai-sdk/openai'
import { CloudinaryService } from '@api/cloudinary/cloudinary.service'
import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { Injectable } from '@nestjs/common'
import { generateText } from 'ai'
import OpenAI from 'openai'
import { z } from 'zod'

@Injectable()
export class GeneratedImageService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async create(
    inputText: string,
    categoriesObject: z.infer<typeof CreateImageSchema>['inputOptions']
  ) {
    let categories = []
    for (const [key, value] of Object.entries(categoriesObject)) {
      if (value) categories.push(key)
    }

    let finalCategories
    if (categories.length === 1) {
      finalCategories = categories[0]
    } else {
      finalCategories = `${categories.slice(0, -1).join(', ')} and ${categories.at(-1)}`
    }

    const finalInput =
      `Write a detailed prompt for the Dall-e-3 image generation AI that results in an image that is` +
      `${finalCategories} and expresses the following text: "${inputText}". The prompt must not be longer than 950 characters.`

    const { text: prompt } = await generateText({
      model: openai_aisdk('gpt-4o-mini'),
      system:
        'You are a professional writer and artist. ' +
        'You write simple, clear, and concise content, focusing on visual descriptions.',
      prompt: finalInput,
    })

    if (prompt.length > 950)
      throw new Error(
        "Don't throw an error later but length is " + prompt.length
      )
    const shortenedText = prompt.substring(0, 950)

    // automatically takes the API-key from process.env.OPENAI_API_KEY
    const openai_client = new OpenAI()

    const response = await openai_client.images.generate({
      model: 'dall-e-3',
      prompt: shortenedText,
      n: 1,
      size: '1024x1024',
    })
    console.log('response all is, reponse')
    console.log(response.data[0].url)
    // convert to URL to make sure it's a valid URL
    const url = new URL(response.data[0].url!)
    console.log('url is ', url)
    if (!url) throw new Error('No url defined:' + url)

    const result = await this.cloudinaryService.uploadFileFromURL(
      url.toString()
    )

    console.log('our result is', result)

    return {
      text: 'call this.model.create with',
      inputText,
      categories,
      finalInput,
      prompt,
      shortenedText,
      url,
      result,
    }
  }

  findAll() {
    return `This action returns all generatedImage`
  }

  findOne(id: number) {
    return `This action returns a # generatedImage`
  }

  update() {
    return `This action updates a # generatedImage`
  }

  remove(id: number) {
    return `This action removes a # generatedImage`
  }
}
