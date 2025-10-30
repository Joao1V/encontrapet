'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { saveToken } from '@/lib/axios/utils/token';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

export default function ReactQueryProvider({
   children,
   token,
}: {
   children: ReactNode;
   token: string | undefined;
}) {
   const { data: session, status } = useSession();
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  refetchOnWindowFocus: false,
                  refetchOnMount: false,
                  refetchOnReconnect: false,
                  retry: false,
                  staleTime: 5 * 1000,
                  experimental_prefetchInRender: true,
                  queryFn: () => {},
               },
            },
         }),
   );
   if (token) {
      saveToken(token);
   }

   useEffect(() => {
      if (session && status === 'authenticated') {
         saveToken(session.token);
         if (session.exp) {
            console.log('expireAt', format(new Date(session.exp * 1000), 'dd/MM/yy HH:mm:ss'));
         }
      }
   }, [status, session]);

   return (
      <QueryClientProvider client={queryClient}>
         {children}
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
}
