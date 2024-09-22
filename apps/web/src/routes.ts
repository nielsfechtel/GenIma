/**
 * An array of routes accessible to the public.
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/', '/landingpage']
/**
 * An array of routes accessible to the public.
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/signup', '/auth/verify']

/**
 * The routes accessible only to users with the admin-role
 */
export const adminRoutes = ['/admin-panel']

/**
 * The default redirect after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/dashboard'
