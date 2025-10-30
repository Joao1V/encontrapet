'use client';
import { useState } from 'react';
import {
   Button,
   Card,
   CardBody,
   CardHeader,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   Tooltip,
} from '@heroui/react';
import { LABEL_BY_VALUE } from '@encontra-pet/utils';

import { useDeleteAnimal } from '@/features/animals/services';
import { useQueryClient } from '@tanstack/react-query';
import { PawPrint, Pencil, Trash2 } from 'lucide-react';
import type { Animal } from '../services/api';
import AnimalForm from './animal-form';

type Props = {
   animals?: Animal[] | null;
   loading?: boolean;
   selectedId?: string;
   onSelect(id: string): void;
};

export default function AnimalPicker({ animals, loading, selectedId, onSelect }: Props) {
   const empty = !loading && (animals?.length ?? 0) === 0;
   const [deletingId, setDeletingId] = useState<string | null>(null);
   const [editing, setEditing] = useState<Animal | null>(null);
   const deleteMutation = useDeleteAnimal();
   const qc = useQueryClient();

   const handleDeleteClick = async (id: string, name?: string) => {
      const ok = window.confirm(`Tem certeza que deseja excluir${name ? ` "${name}"` : ''}?`);
      if (!ok) return;
      try {
         setDeletingId(id);
         await deleteMutation.mutateAsync(id);
      } finally {
         setDeletingId(null);
      }
   };

   const handleEditSaved = async () => {
      setEditing(null);
      // await qc.invalidateQueries({ queryKey: publishKeys.animals });
   };

   return (
      <div className="flex flex-col gap-6">
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {animals?.map((a) => {
               const selected = selectedId === a.id;
               const isDeleting =
                  deletingId === a.id || (deleteMutation.isPending && deletingId === a.id);
               return (
                  <Card
                     key={a.id}
                     isPressable
                     as={'div'}
                     onPress={() => !isDeleting && onSelect(a.id)}
                     className={
                        (selected ? 'border-2 border-primary' : '') +
                        'relative transition-shadow hover:shadow-md'
                     }
                  >
                     <div className="absolute top-2 right-2 z-20 flex gap-1">
                        <Tooltip
                           content="Editar"
                           placement="top"
                           closeDelay={0}
                           isDisabled={isDeleting}
                        >
                           <Button
                              type="button"
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => setEditing(a)}
                              isDisabled={isDeleting}
                           >
                              <Pencil className="h-4 w-4" />
                           </Button>
                        </Tooltip>
                        <Tooltip
                           content="Excluir"
                           placement="top"
                           closeDelay={0}
                           isDisabled={isDeleting}
                        >
                           <Button
                              type="button"
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={(ev) => handleDeleteClick(a.id, a.name)}
                              isDisabled={isDeleting}
                              isLoading={isDeleting}
                           >
                              <Trash2 className="h-4 w-4 text-danger" />
                           </Button>
                        </Tooltip>
                     </div>
                     <CardHeader className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                           <PawPrint className="h-5 w-5" />
                        </div>
                        <div className="font-semibold">{a.name}</div>
                     </CardHeader>
                     <CardBody className="text-default-500 text-sm">
                        <div
                           className={`flex flex-wrap items-center gap-2 ${isDeleting ? 'opacity-50' : ''}`}
                        >
                           <span>{LABEL_BY_VALUE.species[a.species]}</span>
                           {a.size ? <span>• {LABEL_BY_VALUE.size[a.size]}</span> : null}
                           {a.color ? <span>• {a.color}</span> : null}
                        </div>
                     </CardBody>
                  </Card>
               );
            })}
         </div>

         <Modal isOpen={!!editing} onOpenChange={() => setEditing(null)}>
            <ModalContent>
               {() => (
                  <>
                     <ModalHeader>Editar animal</ModalHeader>
                     <ModalBody>
                        {editing ? (
                           <AnimalForm
                              animalId={editing.id}
                              initial={{
                                 name: editing.name,
                                 species: editing.species as any,
                                 size: editing.size as any,
                                 color: editing.color || undefined,
                                 has_collar: !!editing.has_collar,
                                 gender: editing.gender as any,
                                 notes: editing.notes || undefined,
                                 photos: [],
                              }}
                              onSaved={handleEditSaved}
                              onCancel={() => setEditing(null)}
                           />
                        ) : null}
                     </ModalBody>
                  </>
               )}
            </ModalContent>
         </Modal>

         {empty ? (
            <div className="rounded-large border border-dashed p-6 text-center text-default-500">
               Você ainda não cadastrou nenhum animal.
            </div>
         ) : null}
      </div>
   );
}
