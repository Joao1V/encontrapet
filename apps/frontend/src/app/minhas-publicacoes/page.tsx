'use client';

import { Button, Spinner } from '@heroui/react';

import { PostCard } from '@/features/feed/components/post-card';
import { useMyPostsQuery } from '@/features/publish/services';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function MyPostsPage() {
   const { data: posts, error, isLoading } = useMyPostsQuery();

   if (isLoading) {
      return (
         <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner label="Carregando suas publicações..." />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-default-50">
         <div className="container mx-auto max-w-2xl px-4 pt-8 pb-24">
            <div className={'mb-6 flex justify-between'}>
               <h1 className="font-bold text-2xl">Minhas publicações</h1>
               <div className="flex items-center gap-3">
                  <Button
                     as={Link}
                     href="/nova-publicacao"
                     color="primary"
                     startContent={<Plus className="h-5 w-5" />}
                     className="hidden font-semibold md:inline-flex"
                  >
                     Nova Publicação
                  </Button>
               </div>
            </div>

            {error && <p className="py-4 text-center text-danger">{error.message}</p>}

            {!isLoading && !error && posts?.docs.length === 0 && (
               <p className="text-center text-default-500">
                  Você ainda não criou nenhuma publicação.
               </p>
            )}
            <div className="flex flex-col gap-6">
               {!isLoading && !error && posts?.docs.map((p) => <PostCard key={p.id} {...p} />)}
            </div>
         </div>
      </div>
   );
}
