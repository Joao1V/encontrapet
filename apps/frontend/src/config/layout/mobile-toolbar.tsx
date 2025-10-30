'use client';

import { AuthAvatar } from '@/features/auth/components/auth-avatar';
import { Heart, Home, PlusCircle, Search, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function NavItem({
   href,
   label,
   icon,
   active,
   onClick,
}: {
   href: string;
   label: string;
   icon: React.ReactNode;
   active?: boolean;
   onClick?: (e: React.MouseEvent) => void;
}) {
   return (
      <Link
         href={href}
         aria-label={label}
         onClick={onClick}
         className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs ${
            active ? 'text-primary' : 'text-default-500'
         }`}
      >
         {icon}
         <span>{label}</span>
      </Link>
   );
}

export function MobileToolbar() {
   const pathname = usePathname();
   const router = useRouter();
   const { data: session } = useSession();
   const isAuthenticated = Boolean(session?.user);

   const handleSearchClick = (e: React.MouseEvent) => {
      if (pathname?.startsWith('/feed')) {
         e.preventDefault();
         if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('focus-feed-search'));
         }
         return;
      }
      e.preventDefault();
      router.push('/feed#search');
   };

   const handleNewClick = (e: React.MouseEvent) => {
      if (!isAuthenticated) {
         e.preventDefault();
         const callbackUrl = encodeURIComponent('/nova-publicacao');
         router.push(`/login?callbackUrl=${callbackUrl}`);
      }
      // if authenticated, allow default navigation
   };

   return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 block md:hidden">
         <div className="pointer-events-auto mx-auto max-w-2xl border-default-200 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav
               className="flex items-stretch justify-between px-2"
               style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
               <NavItem
                  href="/feed"
                  label="Feed"
                  icon={
                     <Home
                        className={`h-6 w-6 ${pathname?.startsWith('/feed') ? 'text-primary' : ''}`}
                     />
                  }
                  active={pathname?.startsWith('/feed')}
               />
               <NavItem
                  href="/feed#search"
                  label="Buscar"
                  icon={<Search className="h-6 w-6" />}
                  active={false}
                  onClick={handleSearchClick}
               />
               <NavItem
                  href="/nova-publicacao"
                  label="Nova"
                  icon={
                     <PlusCircle
                        className={`h-8 w-8 ${pathname === '/nova-publicacao' ? 'text-primary' : ''}`}
                     />
                  }
                  active={pathname === '/nova-publicacao'}
                  onClick={handleNewClick}
               />
               <NavItem
                  href="#favoritos"
                  label="Favoritos"
                  icon={
                     <Heart
                        className={`h-6 w-6 ${pathname === '/favoritos' ? 'text-primary' : ''}`}
                     />
                  }
                  active={pathname === '/favoritos'}
               />
               {/* Profile: only show avatar for authenticated users. When not authenticated, show login icon */}
               <div className="flex flex-1 items-center justify-center py-2">
                  {isAuthenticated ? (
                     <AuthAvatar />
                  ) : (
                     <Link
                        href="/login"
                        aria-label="Entrar"
                        className="flex flex-col items-center justify-center gap-1 text-default-500"
                     >
                        <UserIcon className="h-6 w-6" />
                        <span className="text-xs">Entrar</span>
                     </Link>
                  )}
               </div>
            </nav>
         </div>
      </div>
   );
}
