'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button, Input, Spinner, Tab, Tabs, Tooltip } from '@heroui/react';

import { PostCard } from '@/features/feed/components/post-card';
import { usePostsQuery } from '@/features/publish/services';
import { LocateFixed, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
   const searchRef = useRef<HTMLInputElement | null>(null);
   const [selected, setSelected] = useState<'all' | 'lost' | 'found'>('all');

   const [query, setQuery] = useState('');
   const { data, isLoading, isError, error } = usePostsQuery();

   const filteredPosts =
      data?.docs.filter((post) => {
         // Filter by status
         if (selected !== 'all' && post.type !== selected) {
            return false;
         }
         // Filter by location query
         if (query) {
            const location =
               typeof post.location === 'object' && post.location
                  ? `${post.location.district || ''} ${post.location.city} ${post.location.state}`
                  : '';
            return location.toLowerCase().includes(query.toLowerCase());
         }
         return true;
      }) || [];

   useEffect(() => {
      const focusSearch = () => {
         const root = searchRef.current;
         if (!root) return;
         root.focus();
      };
      if (typeof window !== 'undefined' && window.location.hash === '#search') {
         setTimeout(focusSearch, 0);
      }
      window.addEventListener('focus-feed-search', focusSearch);
      return () => {
         window.removeEventListener('focus-feed-search', focusSearch);
      };
   }, []);

   return (
      <div className="min-h-screen bg-default-50">
         <div className="container mx-auto max-w-2xl px-4 pt-8 pb-24">
            {/* Header */}
            <div className="mb-6 flex items-center justify-end">
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

            {/* Filtros */}
            <div className="mb-4 flex flex-col gap-2">
               {/* Linha de endereço detectado / erro (acima do input) */}
               {/*{myCoords && (*/}
               {/*   <div className="min-h-[20px]">*/}
               {/*      <div className="flex items-center gap-2 pl-1">*/}
               {/*         <span className="relative inline-flex h-2.5 w-2.5">*/}
               {/*            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>*/}
               {/*            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>*/}
               {/*         </span>*/}
               {/*         <p className="text-default-500 text-xs">*/}
               {/*            {addressLoading*/}
               {/*               ? 'Obtendo endereço…'*/}
               {/*               : addressText ||*/}
               {/*                 `Localização ativa (${myCoords.lat.toFixed(5)}, ${myCoords.lng.toFixed(5)})`}*/}
               {/*         </p>*/}
               {/*      </div>*/}
               {/*      {!myCoords && geoError && (*/}
               {/*         <p className="pl-1 text-danger text-xs">{geoError}</p>*/}
               {/*      )}*/}
               {/*   </div>*/}
               {/*)}*/}

               {/* Linha principal: Buscar + Localizar (no endContent) */}
               <div className="flex items-center gap-2">
                  <Input
                     value={query}
                     onValueChange={setQuery}
                     ref={searchRef}
                     startContent={<MapPin className="h-4 w-4 text-default-400" />}
                     placeholder="Buscar por bairro/cidade"
                     aria-label="Buscar por localização"
                     className="min-w-0 flex-1"
                     // endContent={
                     //    <Tooltip
                     //       content={
                     //          myCoords
                     //             ? 'Localização ativada — tocar para limpar'
                     //             : 'Usar minha localização'
                     //       }
                     //    >
                     //       <Button
                     //          isIconOnly
                     //          radius={'full'}
                     //          variant={myCoords ? 'solid' : 'light'}
                     //          color={myCoords ? 'primary' : 'default'}
                     //          onPress={myCoords ? clearLocation : handleUseMyLocation}
                     //          isLoading={locating}
                     //          aria-label={
                     //             myCoords ? 'Limpar minha localização' : 'Usar minha localização'
                     //          }
                     //          className={myCoords ? '' : 'bg-transparent'}
                     //          size="sm"
                     //       >
                     //          <LocateFixed className={'h-4 w-4'} />
                     //       </Button>
                     //    </Tooltip>
                     // }
                  />
               </div>
            </div>

            {/* Tabs Filter */}
            <div className="mb-6">
               <Tabs
                  selectedKey={selected}
                  onSelectionChange={(key) => setSelected(key as 'all' | 'lost' | 'found')}
                  aria-label="Filtrar publicações"
               >
                  <Tab key="all" title="Todos" />
                  <Tab key="lost" title="Perdido" />
                  <Tab key="found" title="Encontrado" />
               </Tabs>
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-6">
               {isLoading && (
                  <div className="flex justify-center py-12">
                     <Spinner label="Carregando publicações..." />
                  </div>
               )}
               {isError && (
                  <p className="py-4 text-center text-danger">
                     Ocorreu um erro ao carregar as publicações:{' '}
                     {(error as any)?.message || 'Erro desconhecido'}
                  </p>
               )}
               {!isLoading &&
                  !isError &&
                  filteredPosts.map((post) => <PostCard key={post.id} {...post} />)}
               {!isLoading && !isError && filteredPosts.length === 0 && (
                  <p className="text-center text-default-500">
                     Nenhum post encontrado para os filtros atuais.
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}
