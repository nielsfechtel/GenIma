import { openai as openai_aisdk } from '@ai-sdk/openai'
import { API_Key, API_KeyDocument } from '@api/api_key/schemas/api_key.schema'
import { CloudinaryService } from '@api/cloudinary/cloudinary.service'
import { GeneratedImage } from '@api/generated_image/schemas/generated_image.schema'
import { CreateImageSchema } from '@api/schemas/create-image.schema'
import { User } from '@api/users/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { TRPCError } from '@trpc/server'
import { generateText } from 'ai'
import { Model } from 'mongoose'
import OpenAI from 'openai'
import { z } from 'zod'

@Injectable()
export class GeneratedImageService {
  constructor(
    @InjectModel(GeneratedImage.name)
    private genImageModel: Model<GeneratedImage>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(API_Key.name) private apiKeyModel: Model<API_Key>,
    private cloudinaryService: CloudinaryService
  ) {}

  async create({
    email,
    apiKeyName,
    inputText,
    categoriesObject,
  }: {
    email: string
    apiKeyName: string
    inputText: string | null
    categoriesObject: z.infer<typeof CreateImageSchema>['inputOptions']
  }) {
    const user = await this.userModel.findOne({ email }).populate('api_keys')
    if (!user)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No user found!' })

    // reduce usages - either of API Key or of User - the latter is not currently implemented
    if (apiKeyName) {
      // find the API key...
      // we know this is a valid API-Key-Doc (via populate above) - so _id exists -
      // but Typescript doesn't know that so we need to (?) cast it with `as API_KeyDocument`
      const apiKeyUsed = user.api_keys.filter(
        (key) => key.name === apiKeyName
      )[0] as API_KeyDocument

      if (!apiKeyUsed)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No key found' })
      const keyDocument = await this.apiKeyModel.findById(apiKeyUsed._id)
      if (!keyDocument)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No key found' })

      if (keyDocument.usesLeft <= 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Key has no uses left!',
        })

      keyDocument.usesLeft--

      await keyDocument.save()
    }

    // prepare categories and final input
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

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      {
        $push: {
          images: newImage._id,
        },
      }
    )

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
