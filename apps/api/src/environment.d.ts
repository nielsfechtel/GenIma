declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      DB_CONNECTION_URI: string
      EMAIL: string
      EMAIL_APP_PASSWORD: string
      JWT_KEY: string
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