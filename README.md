# Graduation project for CLA

## Overview

This project utilizes NextJS for the Frontend and webserver, as well as NestJS with tRPC for the API.

Using a text supplied by the user along with some categories, ChatGPT (4o-mini) and Dall-e-3 are used to turn your input into an image.
Give it a try!

_(Also try accessing the 404-page a few times!)_

## Environment variables
Format these like:
`.env.<environment>`, e.g. `.env.local`, `.env.test` or `.env.prod`.

### apps/web
#### API
- API_SERVER_URL: the URL of backend
#### Authentication
- AUTH_GOOGLE_ID: Google OAuth Client ID
- AUTH_GOOGLE_SECRET: Google OAuth Secret
- AUTH_SECRET: a secret used by Next-Auth. Can be generated with `npx auth secret`.

### apps/api
> This file has to be in `apps/api/config`!
#### Authentication
- JWT_KEY: a random long string used for encrypting the JWTs
#### OpenAI
- OPENAI_API_KEY: the OpenAI-package auto-reads this from `process.env`
#### Cloudinary
- CLOUDINARY_NAME: the Cloudinary project name
- CLOUDINARY_API_KEY: the key
- CLOUDINARY_API_SECRET: the secret
#### Emails
- RESEND_API_KEY
- HELLO_EMAIL_ADDRESS: the address used for hello@..., e.g. for verify-email-mails
- WEB_BASE_URL: the base-url used for the link in the e.g. verify-email-mails
#### Database
- DB_CONNECTION_URL: a Mongo DB-connection-string, including user and password
