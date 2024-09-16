declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production'
      PORT: number
      DB_CONNECTION_URL: string
      JWT_KEY: string
      PORT: number
      BASE_URL: string
      RESEND_HOST: string
      RESEND_PORT: number
      RESEND_USERNAME: string
      RESEND_PASSWORD: string
      HELLO_EMAIL_ADDRESS: string
    }
  }
}

/*
Thanks to: https://stackoverflow.com/a/53981706/5272905

"Note: the snippet above is module augmentation.
Files containing module augmentation must be modules
(as opposed to scripts). The difference between modules
and scripts is that modules have at least one
import/export statement.

In order to make TypeScript treat your file as a
module, just add one import statement to it. It can be anything.
Even export {} will do."
*/
export {}
