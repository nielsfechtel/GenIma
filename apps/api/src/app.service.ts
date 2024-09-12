import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}

  sendMail() {
    const port =
      process.env.NODE_ENV === 'production' ? '' : `:${process.env.PORT}`

    const linkWithToken = `${process.env.BASE_URL}${port}/auth/verify/asdf1234a098234token`

    this.mailService
      .sendMail({
        to: 'nfechtel@gmail.com',
        subject: `Verify your email for Niels Graduation Project`,
        template: 'verifyEmail',
        context: {
          linkWithToken,
        },
      })
      .then(() => {
        console.log('shoulda sent mail!')
      })
      .catch((error) => {
        console.log('mail sent error here~!!!: ', error)
      })
  }
}
