import { SESSION_MAX_AGE } from '@encontra-pet/utils';

import { NEXTAUTH_PREFIX_COOKIE_NAME } from '@/app/api/helpers/constants';
import { IS_PRODUCTION } from '@/config/env';
import { AuthService } from '@/features/auth/services';
import { jwtDecode } from 'jwt-decode';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
   // Ensure a stable secret in dev to avoid session invalidation after refresh
   secret: process.env.NEXTAUTH_SECRET,
   session: {
      strategy: 'jwt',
      maxAge: SESSION_MAX_AGE,
   },
   jwt: {
      maxAge: SESSION_MAX_AGE,
   },
   pages: {
      signIn: '/login',
   },
   providers: [
      CredentialsProvider({
         type: 'credentials',
         name: 'Credentials',
         id: 'credentials',

         credentials: {
            email: { label: 'Login', type: 'text' },
            password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            try {
               const { password, email } = credentials;
               const response = await AuthService.login({
                  email,
                  password,
               });

               return { ...response.user, token: response.token };
            } catch (err) {
               console.error('Authorization error:', err);
               return null;
            }
         },
      }),
   ],

   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.user = user;

            if (user.token) {
               token.token = user.token;

               try {
                  // Decodifica o token JWT do Payload
                  const decoded: { exp?: number } = jwtDecode(user.token);

                  console.log('DECODADOOOO');
                  console.log(decoded);
                  if (decoded.exp) {
                     token.exp = decoded.exp;
                  }
               } catch (err) {
                  console.error('Erro ao decodificar token JWT do Payload:', err);
               }
            }
         }

         return token;
      },

      async session({ session, token }) {
         session.user = token.user;
         session.token = token.token;
         session.exp = token.exp;
         return session;
      },
   },
   cookies: {
      sessionToken: {
         name: `${NEXTAUTH_PREFIX_COOKIE_NAME}.session-token`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: IS_PRODUCTION,
         },
      },
      callbackUrl: {
         name: `${NEXTAUTH_PREFIX_COOKIE_NAME}.callback-url`,
         options: {
            sameSite: 'lax',
            path: '/',
            secure: IS_PRODUCTION,
         },
      },
      csrfToken: {
         name: `${NEXTAUTH_PREFIX_COOKIE_NAME}.csrf-token`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: IS_PRODUCTION,
         },
      },
   },
};
