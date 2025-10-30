import type { User as UserPayload } from '@payload-types';

// --------------- NEXT-AUTH TYPES ---------------
declare module 'next-auth' {
   /**
    * Representa o usuário retornado do Payload e usado na sessão
    */
   interface User extends UserPayload {
      token: string; // JWT emitido pelo Payload
   }

   /**
    * Sessão disponível no cliente e no servidor
    */
   interface Session {
      user: User; // dados do usuário (Payload)
      token: string; // JWT do Payload
      exp?: number; // expiração do token (timestamp UNIX)
   }
}

// --------------- NEXT-AUTH JWT TYPES ---------------
declare module 'next-auth/jwt' {
   interface JWT {
      user: import('next-auth').User;
      token: string;
      exp?: number;
   }
}
