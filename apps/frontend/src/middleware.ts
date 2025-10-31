import { hasActiveSession } from '@/app/api/helpers/utils';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const PROTECTED_ROUTES = ['/nova-publicacao', '/meus-animais'] as const;

const middleware = withAuth(
   (req) => {
      return NextResponse.next();
   },
   {
      callbacks: {
         authorized: ({ req }) => {
            const pathname = req.nextUrl.pathname;
            if (
               pathname === '/painel' ||
               PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
            ) {
               return hasActiveSession(req);
            }
            return true;
         },
      },
   },
);

export default middleware;

export const config = {
   matcher: [...PROTECTED_ROUTES, '/login'],
};
