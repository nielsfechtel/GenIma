# Graduation project for CLA

## Overview

This project utilizes NextJS for the Frontend and webserver, as well as NestJS with tRPC for the API.

Using a text supplied by the user along with some categories, ChatGPT (4o-mini) and Dall-e-3 are used to turn your input into an image.
Give it a try!

_(Also try accessing the 404-page a few times!)_

## Environment variables
Format these like:
`.env.<environment>`, e.g. `.env.local`, `.env.test` or `.env.prod`.

The following are required:

### Database
- DB_CONNECTION_URL: a Mongo DB-connection-string, including user and password

### API
- API_SERVER_URL: the URL of backend

### Emails
- RESEND_HOST: the Resend-host
- RESEND_USERNAME: the Resend-username
- RESEND_PASSWORD: the Resend-password
- HELLO_EMAIL_ADDRESS: the address used for hello@..., e.g. for verify-email-mails
- WEB_BASE_URL: the base-url used for the link in the e.g. verify-email-mails

### Login
- JWT_KEY: the a random long string used for encrypting the JWTs
- AUTH_GOOGLE_ID: the for Google-login

### Cloudinary
- CLOUDINARY_NAME: the Cloudinary project name
- CLOUDINARY_API_KEY: the key
- CLOUDINARY_API_SECRET: the secret

### OpenAI
- OPENAI_API_KEY: the OpenAI-package auto-reads this from `process.env`
