import { HeroUIProvider } from '@heroui/react';

import { auth } from '@/app/api/auth';
import { Footer } from '@/config/layout/footer';
import { Header } from '@/config/layout/header';
import { MobileToolbar } from '@/config/layout/mobile-toolbar';
import NextAuthProvider from '@/config/providers/next-auth-provider';
import ReactQueryProvider from '@/config/providers/react-query-provider';

type ProvidersProps = {
   children: React.ReactNode;
};

export async function Providers(props: ProvidersProps) {
   const { children } = props;
   const session = await auth();

   return (
      <NextAuthProvider session={session}>
         <ReactQueryProvider token={session?.token}>
            <HeroUIProvider labelPlacement={'inside'}>
               <Header />
               {children}
               <Footer />
               <MobileToolbar />
            </HeroUIProvider>
         </ReactQueryProvider>
      </NextAuthProvider>
   );
}
