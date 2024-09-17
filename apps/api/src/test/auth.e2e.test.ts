import { AppModule } from '@api/app.module'
import { AuthModule } from '@api/auth/auth.module'
import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { TrpcModule } from '@api/trpc/trpc.module'
import { AppRouter, TrpcRouter } from '@api/trpc/trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { User, UserSchema } from '@api/users/schemas/user.schema'
import { UserTrpcRouter } from '@api/users/user.trpc.router'
import { UsersModule } from '@api/users/users.module'
import { UsersService } from '@api/users/users.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import {
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterOutputs,
  TRPCError,
} from '@trpc/server'

describe('Auth Tests', () => {
  let app: INestApplication
  let appRouter: AppRouter

  beforeAll(async () => {
    // this is an end-to-end (e2)-test-setup - we're creating a full app
    // this setup is further explained here https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TrpcModule,
        AuthModule,
        UsersModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        TrpcRouter,
        AuthTrpcRouter,
        TrpcService,
        UserTrpcRouter,
        UsersService,
        JwtService,
      ],
    }).compile()
    /* you could override e.g. a provider (service) like so:
     .overrideProvider(CatsService)
      .useValue(catsService)
    and   let catsService = { findAll: () => ['test'] };
    */

    app = moduleRef.createNestApplication()
    await app.init()

    appRouter = app.get<TrpcRouter>(TrpcRouter).appRouter

    // clear users
    const usersService = app.get<UsersService>(UsersService)
    usersService.deleteMany()
  })

  afterAll(async () => {
    // clear users
    const usersService = app.get<UsersService>(UsersService)
    await usersService.deleteMany()
    await app.close()
  })

  it('should not signup with invalid input data', async () => {
    const createCaller = app
      .get<TrpcService>(TrpcService)
      .createCallerFactory(appRouter)
    const unauthedCaller = createCaller({})

    // creating a valid input-object by getting what's expected for this procedure
    const input: inferProcedureInput<AppRouter['auth']['signUp']> = {
      email: 'nfechtel@gmail.com',
      password: 'hello8test',
      firstName: 'Sabrina',
      lastName: 'Witch',
    }

    await expect(
      unauthedCaller.auth.signUp({
        ...input,
        email: '',
      })
    ).rejects.toBeInstanceOf(TRPCError)

    await expect(
      unauthedCaller.auth.signUp({
        ...input,
        password: '',
      })
    ).rejects.toBeInstanceOf(TRPCError)

    await expect(
      unauthedCaller.auth.signUp({
        ...input,
        email: 'not_an_email',
      })
    ).rejects.toBeInstanceOf(TRPCError)
    // Note: the above does work, but I've not yet figured out how to expect a
    // _specific_ TRPCError. To test this, simply use toThrow(new TRPCError({ ... }))
    // in there, it usually expected code, message and sometimes cause, but I couldn't get it to work.
    // Docs-Link for TRPCErrors: https://trpc.io/docs/server/error-handling#handling-errors
    // await expect(unauthedCaller.auth.signUp(badInput)).rejects.toThrow(
    //   new TRPCError({
    //     code: 'BAD_REQUEST',
    //   })
    // )
    // Note: this helpful code-snippet: https://research-git.uiowa.edu/beggr/hospitality/-/blob/349ae3b19158ad3f122df05eece752d72eb98309/tests/jest/reset-password.test.ts
    // has some great examples of the expect-TRPCError etc.
    // I found it by searching https://www.google.com/search?q=jest+expect+specific+type+of+%22TRPCError%22&oq=jest+expect+specific+type+of+%22TRPCError%22
  })

  it('should sign up with valid data', async () => {
    const usersService = app.get<UsersService>(UsersService)
    const createCaller = app
      .get<TrpcService>(TrpcService)
      .createCallerFactory(appRouter)
    const unauthedCaller = createCaller({})

    // creating a valid input-object by getting what's expected for this procedure
    const input: inferProcedureInput<AppRouter['auth']['signUp']> = {
      email: 'nfechtel@gmail.com',
      password: 'hello8test',
      firstName: 'Sabrina',
      lastName: 'Witch',
    }
    const output: inferProcedureOutput<AppRouter['auth']['signUp']> = {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    }

    const newUser = await unauthedCaller.auth.signUp(input)

    expect(newUser).toMatchObject(output)

    const foundNewUser = await usersService.findOneByEmail(input.email)
    expect(foundNewUser).toMatchObject(output)
  })

  it('should login a user with the correct data, and fail with invalid data', async () => {
    const jwtService = app.get<JwtService>(JwtService)
    const usersService = app.get<UsersService>(UsersService)
    const createCaller = app
      .get<TrpcService>(TrpcService)
      .createCallerFactory(appRouter)
    const unauthedCaller = createCaller({})

    // creating a valid input-object by getting what's expected for this procedure
    const input: inferProcedureInput<AppRouter['auth']['login']> = {
      email: 'nfechtel2@gmail.com',
      password: 'hello8test',
    }
    const createdUser = await unauthedCaller.auth.signUp({
      firstName: 'Marie',
      ...input,
    })

    // create the expected token; for that we need the _id
    const returnedUser = await usersService.findOneByEmail(createdUser.email)

    // first test not-verified login
    // await expect(unauthedCaller.auth.login(input)).rejects.toBeInstanceOf(
    //   TRPCError
    // )
    // await expect(unauthedCaller.auth.login(input)).rejects.toThrow(
    //   new TRPCError({
    //     code: 'BAD_REQUEST',
    //     message: 'Please verify your email',
    //   })
    // )

    // now manually verify to test logins
    usersService.update(returnedUser!._id.toString(), { isVerified: true })

    const payload = { sub: returnedUser!._id, email: createdUser.email }
    const token = await jwtService.signAsync(payload, {
      secret: process.env.JWT_KEY,
    })
    const output: inferRouterOutputs<AppRouter>['auth']['login'] = {
      accessToken: token,
      data: {
        email: input.email,
        firstName: createdUser.firstName,
        lastName: '',
      },
    }

    const returnedToken = await unauthedCaller.auth.login(input)
    expect(returnedToken).toStrictEqual(output)

    // test false logins
    const ehm = await unauthedCaller.auth.login({
      email: 'a@gmail.com',
      password: input.password,
    })
    console.log('ehm', ehm)

    await expect(
      unauthedCaller.auth.login({
        email: 'not_an_email',
        password: input.password,
      })
    ).rejects.toBeInstanceOf(TRPCError)
    await expect(
      unauthedCaller.auth.login({
        email: input.email,
        password: 'nanunana',
      })
    ).rejects.toBeInstanceOf(TRPCError)
  })
})
