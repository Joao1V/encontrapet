'use client';

import { useState } from 'react';
import {
   Button,
   Navbar,
   NavbarBrand,
   NavbarContent,
   NavbarItem,
   NavbarMenu,
   NavbarMenuItem,
   NavbarMenuToggle,
} from '@heroui/react';

import { AuthAvatar } from '@/features/auth/components/auth-avatar';
import { Heart, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export function Header() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const router = useRouter();
   const { data: session } = useSession();

   const handleLogout = async () => {
      await signOut({ redirect: false });
      router.push('/');
   };

   const menuItems = [
      { label: 'Como Funciona', href: '/#como-funciona' },
      { label: 'Recursos', href: '/#recursos' },
      { label: 'Sobre', href: '/#sobre' },
   ];

   return (
      <Navbar
         isMenuOpen={isMenuOpen}
         onMenuOpenChange={setIsMenuOpen}
         maxWidth="xl"
         className="border-divider border-b"
      >
         <NavbarContent>
            <NavbarMenuToggle
               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
               className="sm:hidden"
            />
            <NavbarBrand>
               <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                     <Heart className="h-6 w-6 fill-current text-primary-foreground" />
                  </div>
                  <span className="font-bold font-heading text-xl">EncontraPet</span>
               </Link>
            </NavbarBrand>
         </NavbarContent>

         <NavbarContent className="hidden gap-8 sm:flex" justify="center">
            {menuItems.map((item) => (
               <NavbarItem key={item.href}>
                  <Link
                     href={item.href}
                     className="font-medium text-default-600 text-sm transition-colors hover:text-foreground"
                  >
                     {item.label}
                  </Link>
               </NavbarItem>
            ))}
         </NavbarContent>

         <NavbarContent justify="end">
            {session ? (
               <>
                  <NavbarItem className="hidden sm:flex">
                     <Button as={Link} href="/feed" color="primary" variant="light">
                        Feed
                     </Button>
                  </NavbarItem>
                  <NavbarItem className="hidden sm:flex">
                     <AuthAvatar />
                  </NavbarItem>
               </>
            ) : (
               <>
                  <NavbarItem className="hidden sm:flex">
                     <Button as={Link} href="/login" color="primary" variant="light">
                        Entrar
                     </Button>
                  </NavbarItem>
                  <NavbarItem className="hidden sm:flex">
                     <Button
                        as={Link}
                        href="/registro"
                        color="primary"
                        variant="solid"
                        className="font-semibold"
                     >
                        Cadastrar
                     </Button>
                  </NavbarItem>
               </>
            )}
         </NavbarContent>

         <NavbarMenu>
            {menuItems.map((item, index) => (
               <NavbarMenuItem key={`${item.href}-${index}`}>
                  <Link
                     href={item.href}
                     className="w-full text-foreground"
                     onClick={() => setIsMenuOpen(false)}
                  >
                     {item.label}
                  </Link>
               </NavbarMenuItem>
            ))}
            {session ? (
               <>
                  <NavbarMenuItem>
                     <Button
                        as={Link}
                        href="/feed"
                        color="primary"
                        variant="solid"
                        className="w-full font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                     >
                        Feed
                     </Button>
                  </NavbarMenuItem>
                  <NavbarMenuItem>
                     <Button
                        color="danger"
                        variant="solid"
                        type={'button'}
                        className="w-full font-semibold"
                        onPress={() => {
                           handleLogout();
                           setIsMenuOpen(false);
                        }}
                     >
                        Sair
                     </Button>
                  </NavbarMenuItem>
               </>
            ) : (
               <>
                  <NavbarMenuItem>
                     <Button
                        as={Link}
                        href="/login"
                        color="primary"
                        variant="light"
                        className="w-full"
                        onClick={() => setIsMenuOpen(false)}
                     >
                        Entrar
                     </Button>
                  </NavbarMenuItem>
                  <NavbarMenuItem>
                     <Button
                        as={Link}
                        href="/registro"
                        color="primary"
                        variant="solid"
                        className="w-full font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                     >
                        Cadastrar
                     </Button>
                  </NavbarMenuItem>
               </>
            )}
         </NavbarMenu>
      </Navbar>
   );
}
