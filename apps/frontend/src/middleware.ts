import { hasActiveSession } from '@/app/api/helpers/utils';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const middleware = withAuth(
   (req) => {
      return NextResponse.next();
   },
   {
      callbacks: {
         authorized: ({ req }) => {
            const pathname = req.nextUrl.pathname;
            if (pathname === '/painel' || pathname.startsWith('/nova-publicacao')) {
               return hasActiveSession(req);
            }
            return true;
         },
      },
   },
);

export default middleware;

export const config = {
   matcher: ['/nova-publicacao', '/login', '/login/'],
};
