import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - api, _next, _vercel internal routes
  // - files with an extension (e.g. favicon.ico, images)
  // - the generated favicon route (/icon), which has no extension
  matcher: ['/((?!api|_next|_vercel|icon|.*\\..*).*)'],
};
