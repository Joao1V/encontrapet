'use client';

import { useEffect, useMemo, useState } from 'react';
import {
   Button,
   Card,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   Spinner,
   useDisclosure,
} from '@heroui/react';

import { ModalEditAnimal } from '@/features/animals/modal';
import { useDeleteAnimal, useMyAnimalsQuery } from '@/features/animals/services';
import AnimalForm from '@/features/publish/components/animal-form';
import type { AnimalsType } from '@/features/publish/schema/animals.schema';
import type { Animal as AnimalPayload } from '@payload-types';
import { Edit3, Plus, Trash2 } from 'lucide-react';

export default function MyAnimalsPage() {
   const [editing, setEditing] = useState<AnimalPayload | null>(null);

   const disclosureEditAnimal = useDisclosure();
   const { onOpen, onClose } = disclosureEditAnimal;

   const { data: animals, isLoading, error, refetch } = useMyAnimalsQuery();
   const deleteAnimal = useDeleteAnimal();

   const handleCreate = () => {
      setEditing(null);
      onOpen();
   };

   const handleEdit = () => {
      // setEditing(animal);
      onOpen();
   };

   const handleDelete = async () => {
      // if (!confirm(`Deseja excluir o animal "${animal.name}"?`)) return;
      // const ok = await deleteAnimal.mutateAsync(animal.id);
      // if (ok) {
      //    await refetch();
      // }
   };

   const handleSaved = () => {
      onClose();
   };

   if (isLoading && !animals) {
      return (
         <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner label="Carregando..." />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-default-50">
         <div className="container mx-auto max-w-2xl px-4 pt-8 pb-24">
            <div className="mb-6 flex items-center justify-between">
               <h1 className="font-bold text-2xl">Meus animais</h1>
               <Button
                  color="primary"
                  startContent={<Plus className="h-5 w-5" />}
                  onPress={handleCreate}
                  className="font-semibold"
               >
                  Novo animal
               </Button>
            </div>

            {error && <p className="py-4 text-center text-danger">{error.message}</p>}
            {!isLoading && !error && (
               <p className="text-center text-default-500">
                  Você ainda não cadastrou nenhum animal.
               </p>
            )}

            {animals && animals.length === 0 && (
               <div className="flex flex-col gap-4">
                  {animals.map((a) => (
                     <Card key={a.id} className="p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="font-semibold">{a.name}</p>
                              <p className="text-default-500 text-sm capitalize">
                                 {a.species}
                                 {a.size ? ` • ${a.size}` : ''}
                                 {a.color ? ` • ${a.color}` : ''}
                              </p>
                           </div>
                           <div className="flex gap-2">
                              <Button
                                 size="sm"
                                 variant="flat"
                                 onPress={() => handleEdit()}
                                 startContent={<Edit3 className="h-4 w-4" />}
                              >
                                 Editar
                              </Button>
                              <Button
                                 size="sm"
                                 color="danger"
                                 variant="flat"
                                 onPress={() => handleDelete()}
                                 startContent={<Trash2 className="h-4 w-4" />}
                              >
                                 Excluir
                              </Button>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            )}
            {/*<ModalEditAnimal />*/}
         </div>
      </div>
   );
}
