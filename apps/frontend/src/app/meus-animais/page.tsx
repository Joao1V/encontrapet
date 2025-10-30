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

import AnimalForm from '@/features/publish/components/animal-form';
import { type Animal, publishApi } from '@/features/publish/services';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function MyAnimalsPage() {
   const { data: session, status } = useSession();
   const userId = useMemo(() => (session?.user as any)?.id as string | undefined, [session]);

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [animals, setAnimals] = useState<Animal[]>([]);

   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [editing, setEditing] = useState<Animal | null>(null);

   const loadAnimals = async () => {
      if (!userId) return;
      try {
         setLoading(true);
         setError(null);
         // Try to load only user's animals; fallback inside service lists all if not supported
         const data = await publishApi.listMyAnimals(userId);
         setAnimals(data ?? []);
      } catch (e: any) {
         setError(e?.message || 'Não foi possível carregar seus animais.');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadAnimals();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [userId]);

   const handleCreate = () => {
      setEditing(null);
      onOpen();
   };

   const handleEdit = (animal: Animal) => {
      setEditing(animal);
      onOpen();
   };

   const handleDelete = async (animal: Animal) => {
      if (!confirm(`Deseja excluir o animal "${animal.name}"?`)) return;
      const ok = await publishApi.deleteAnimal(animal.id);
      if (ok) {
         setAnimals((prev) => prev.filter((a) => a.id !== animal.id));
      }
   };

   const handleSaved = () => {
      onClose();
      loadAnimals();
   };

   if (status === 'loading') {
      return (
         <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner label="Carregando..." />
         </div>
      );
   }

   if (!userId) {
      return (
         <div className="container mx-auto max-w-2xl px-4 py-10">
            <h1 className="mb-2 font-bold text-xl">Meus animais</h1>
            <p className="text-default-500">Você precisa estar autenticado para ver esta página.</p>
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

            {loading && (
               <div className="flex justify-center py-12">
                  <Spinner label="Carregando seus animais..." />
               </div>
            )}
            {error && <p className="py-4 text-center text-danger">{error}</p>}
            {!loading && !error && animals.length === 0 && (
               <p className="text-center text-default-500">
                  Você ainda não cadastrou nenhum animal.
               </p>
            )}

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
                              onPress={() => handleEdit(a)}
                              startContent={<Edit3 className="h-4 w-4" />}
                           >
                              Editar
                           </Button>
                           <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onPress={() => handleDelete(a)}
                              startContent={<Trash2 className="h-4 w-4" />}
                           >
                              Excluir
                           </Button>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
               <ModalContent>
                  {(close) => (
                     <>
                        <ModalHeader className="flex flex-col gap-1">
                           {editing ? `Editar animal` : `Novo animal`}
                        </ModalHeader>
                        <ModalBody>
                           <AnimalForm
                              initial={editing ?? undefined}
                              animalId={editing?.id}
                              onCreated={handleSaved}
                              onSaved={handleSaved}
                              onCancel={close}
                           />
                        </ModalBody>
                     </>
                  )}
               </ModalContent>
            </Modal>
         </div>
      </div>
   );
}
