// had this in lib/routes.ts export const ROOT = '/'
// export const PUBLIC_ROUTES = ['/']
// export const DEFAULT_REDIRECT = '/protected'
import { handlers } from '@web/src/auth'

export const { GET, POST } = handlers
