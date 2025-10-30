'use client';

import { Avatar, Button, Card, CardBody, CardHeader } from '@heroui/react';

import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
   const { data: session } = useSession();
   const user = session?.user;

   return (
      <div className="min-h-screen bg-default-50 py-8">
         <div className="container mx-auto max-w-2xl px-4">
            <Button
               as={Link}
               href="/feed"
               variant="light"
               startContent={<ArrowLeft className="h-4 w-4" />}
               className="mb-6"
            >
               Voltar ao Feed
            </Button>

            <Card className="shadow-lg">
               <CardHeader className="flex items-center gap-4 px-6 pt-6">
                  <Avatar
                     name={user?.name || 'Usuário'}
                     src={user?.image || undefined}
                     className="h-16 w-16 text-large"
                  />
                  <div className="flex flex-col">
                     <h1 className="font-bold text-2xl">{user?.name || 'Meu Perfil'}</h1>
                     <p className="text-default-500">Bem-vindo ao seu perfil</p>
                  </div>
               </CardHeader>
               <CardBody className="px-6 pb-6">
                  <div className="flex flex-col divide-y divide-default-200 rounded-large bg-content1">
                     <div className="flex items-center gap-3 p-4">
                        <User className="h-5 w-5 text-default-500" />
                        <div className="flex flex-col">
                           <span className="text-default-500 text-xs">Nome</span>
                           <span className="font-medium">{user?.name || '—'}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-4">
                        <Mail className="h-5 w-5 text-default-500" />
                        <div className="flex flex-col">
                           <span className="text-default-500 text-xs">E-mail</span>
                           <span className="font-medium">{user?.email || '—'}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-4">
                        <Phone className="h-5 w-5 text-default-500" />
                        <div className="flex flex-col">
                           <span className="text-default-500 text-xs">Telefone</span>
                           <span className="font-medium">{user?.phone || '—'}</span>
                        </div>
                     </div>
                  </div>
               </CardBody>
            </Card>
         </div>
      </div>
   );
}
