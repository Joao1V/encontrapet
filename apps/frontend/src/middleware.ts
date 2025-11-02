import { hasActiveSession } from '@/app/api/helpers/utils';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const PROTECTED_ROUTES = ['/nova-publicacao', '/meus-animais'] as const;

const middleware = withAuth(
   (req) => {
      const pathname = req.nextUrl.pathname;
      const isAuthenticated = hasActiveSession(req);

      // Redireciona usuários autenticados que tentam acessar /login ou /registro
      if (isAuthenticated && (pathname === '/login' || pathname === '/registro')) {
         return NextResponse.redirect(new URL('/feed', req.url));
      }

      return NextResponse.next();
   },
   {
      callbacks: {
         authorized: ({ req }) => {
            const pathname = req.nextUrl.pathname;

            // Permite acesso ao /login e /registro para usuários não autenticados
            if (pathname === '/login' || pathname === '/registro') {
               return true;
            }

            // Protege rotas autenticadas
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
   matcher: ['/nova-publicacao/:path*', '/meus-animais/:path*', '/painel/:path*', '/login', '/registro'],
};
