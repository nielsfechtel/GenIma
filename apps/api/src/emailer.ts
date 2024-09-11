import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_TOKEN)

const sendVerificationMail = (email: string, token: string) => {
  resend.emails.send({
    from: 'Hello <contact@cla-niels-gradproject.com',
    to: [email],
    subject: 'Verify your account',
    html: `Verify your email by clicking this link: <a href="https://cla-niels-gradproject.com/auth/verify/${token}">Verify now</a>`,
  })
}
