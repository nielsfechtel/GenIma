import { SetMetadata } from '@nestjs/common'

// From the great NextJS-Docs (also check the global App-guard-definition in auth.module.ts)
// In [this file], we export two constants.
// One being our metadata key named IS_PUBLIC_KEY, and the other being our new decorator
// itself that we’re going to call Public (you can alternatively name it SkipAuth or AllowAnon,
// whatever fits your project).
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
