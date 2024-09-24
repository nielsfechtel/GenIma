import { openai as openai_aisdk } from '@ai-sdk/openai'
import { TrpcRouter } from '@api/trpc/trpc.router'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { CoreMessage, generateText } from 'ai'
import helmet from 'helmet'
import OpenAI from 'openai'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  })

  // Security practices
  app.enableCors()
  app.use(helmet())

  // tRPC setup
  const trpc = app.get(TrpcRouter)
  trpc.applyMiddleware(app)

  // get port
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('PORT')
  if (!port) {
    throw new Error(`Environment variable port is missing`)
  }

  // test AI SDK

  const textSnippet =
    'In the PHP file there is no space or anything else before the <?php tag and nothing after the ?> tag... I\'m using Adobe CS5 as editor. In Safari as well as in every online validator I found I get this error: error on line 1 at column 6: XML declaration allowed only at the start of the document The problem is, I can see the empty space in the source code but the error is located at the "l" of the <?xml tag. Does anybody have had this problem and has an idea or just a hint to the right direction to solve this problem? Edit: I\'ve also tried to open and save it with Noteped++ and Ultraedit32 and then upload it to the server... same problem...'
  const categories = 'fantasy and painterly'

  // const { text } = await generateText({
  //   model: openai_aisdk('gpt-4o-mini'),
  //   system:
  //     'You are a professional writer and artist. ' +
  //     'You write simple, clear, and concise content.',
  //   prompt: `Write a detailed prompt for the Dall-e-3 image generation AI, that results in an image that is ${categories} and expresses the following text: "${textSnippet}". The prompt must not be longer than 900 characters.`,
  // })
  // console.log('text is', text)

  // test for text length

  // automatically takes the API-key from process.env.OPENAI_API_KEY
  // const openai_client = new OpenAI()

  // const response = await openai_client.images.generate({
  //   model: 'dall-e-3',
  //   prompt: text,
  //   // dall-e-3 does one image at once; dall-e-2 does up to 10 (variations)
  //   n: 1,
  //   size: '1024x1024',
  // })
  // console.log(response.data[0].url)

  await app.listen(port)

  const messages: CoreMessage[] = []
}
bootstrap()
