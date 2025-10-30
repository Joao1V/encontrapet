'use client';

import type { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({
   children,
   session,
}: {
   children: ReactNode;
   session: any;
}) {
   return (
      <SessionProvider session={session} refetchOnWindowFocus={false}>
         {children}
      </SessionProvider>
   );
}
