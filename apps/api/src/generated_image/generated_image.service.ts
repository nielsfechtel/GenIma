import { openai as openai_aisdk } from '@ai-sdk/openai'
import { CloudinaryService } from '@api/cloudinary/cloudinary.service'
import { GeneratedImage } from '@api/generated_image/schemas/generated_image.schema'
import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { generateText } from 'ai'
import { Model } from 'mongoose'
import OpenAI from 'openai'
import { z } from 'zod'

@Injectable()
export class GeneratedImageService {
  constructor(
    @InjectModel(GeneratedImage.name)
    private genImageModel: Model<GeneratedImage>,
    private cloudinaryService: CloudinaryService
  ) {}

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
      `Write a detailed prompt for the Dall-e-3 image generation AI. It may not be longer than 950 characters. The prompt should result in an image that is` +
      `${finalCategories} and expresses the following text: "${inputText}". Make sure the prompt is not longer than 950 characters.`

    const { text: prompt } = await generateText({
      model: openai_aisdk('gpt-4o-mini'),
      system:
        'You are a professional writer and artist. ' +
        'You write simple, clear, and concise content, focusing on visual descriptions.' +
        'Your texts are never longer than 900 characters.',
      prompt: finalInput,
    })

    // Dall-e-3 accepts up to 1000 characters for the prompt.
    // I could not get GPT-4o-mini to follow the length-guideline; it was always around 1000 characters,
    // even when I gave it a 900-character-limit.
    // Research revealed that LLMs have difficulties accurately counting characters/words like this.
    // Thus I just cut down the text here - the non-shortened text is still about 1000 characters (+/- 100 usually),
    // so not much get's cut off and the image still looks good.
    const shortenedText = prompt.substring(0, 900)

    // automatically takes the API-key from process.env.OPENAI_API_KEY
    const openai_client = new OpenAI()

    const response = await openai_client.images.generate({
      model: 'dall-e-3',
      prompt: shortenedText,
      n: 1,
      size: '1024x1024',
    })

    // convert to URL to make sure it's a valid URL
    const url = new URL(response.data[0].url!)

    const result = await this.cloudinaryService.uploadFileFromURL(
      url.toString()
    )

    const newImage = await this.genImageModel.create({
      inputText,
      categories: categories.join(', '),
      finalInput,
      prompt: shortenedText,
      image_url: result.secure_url,
    })

    return newImage
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
