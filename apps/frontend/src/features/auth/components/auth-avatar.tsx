'use client';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';

import { AuthService } from '@/features/auth/services';
import { LogOut, PawPrint, Rss, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export function AuthAvatar() {
   const { data: session } = useSession();
   const router = useRouter();
   const user = session?.user;
   const handleLogout = async () => {
      AuthService.logout();
      await signOut({
         redirect: false,
      });
      router.replace('/login');
   };
   if (!user) return <></>;
   return (
      <>
         {user && (
            <Dropdown placement="bottom-end">
               <DropdownTrigger>
                  <Avatar
                     as="button"
                     className="cursor-pointer transition-transform hover:scale-105"
                     name={user?.name as string}
                     size="md"
                  />
               </DropdownTrigger>
               <DropdownMenu aria-label="User menu">
                  <DropdownItem key="profile" variant={'faded'}>
                     <div className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-default-500 text-xs">{user.email}</span>
                     </div>
                  </DropdownItem>
                  <DropdownItem
                     key="minhas-publicacoes"
                     startContent={<Rss className="h-4 w-4" />}
                     onPress={() => router.push('/minhas-publicacoes')}
                  >
                     Minhas publicações
                  </DropdownItem>
                  <DropdownItem
                     key="meus-animais"
                     startContent={<PawPrint className="h-4 w-4" />}
                     onPress={() => router.push('/meus-animais')}
                  >
                     Meus animais
                  </DropdownItem>
                  <DropdownItem
                     key="perfil"
                     startContent={<UserRound className="h-4 w-4" />}
                     onPress={() => router.push('/perfil')}
                  >
                     Perfil
                  </DropdownItem>
                  <DropdownItem
                     key="logout"
                     color="danger"
                     startContent={<LogOut className="h-4 w-4" />}
                     onPress={handleLogout}
                  >
                     Sair
                  </DropdownItem>
               </DropdownMenu>
            </Dropdown>
         )}
      </>
   );
}
