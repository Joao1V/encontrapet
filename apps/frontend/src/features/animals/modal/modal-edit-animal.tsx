import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import type { UseDisclosureReturn } from '@heroui/use-disclosure';

import AnimalForm from '@/features/publish/components/animal-form';
import type { Animal as AnimalPayload } from '@payload-types';

type ModalEditAnimalProps = UseDisclosureReturn & {
   isEditing?: boolean;
   defaultValue?: Partial<AnimalPayload> | null;
};

export function ModalEditAnimal(props: ModalEditAnimalProps) {
   const { isOpen, onOpen, onOpenChange, onClose, isEditing, defaultValue } = props;

   return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
         <ModalContent>
            {(close) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">
                     {isEditing ? `Editar animal` : `Novo animal`}
                  </ModalHeader>
                  <ModalBody>
                     <AnimalForm
                        initial={{
                           name: defaultValue?.name,
                           size: defaultValue?.size ?? undefined,
                           gender: defaultValue?.gender ?? undefined,
                           notes: defaultValue?.notes ?? undefined,
                           species: defaultValue?.species,
                           color: defaultValue?.color ?? undefined,
                           has_collar: defaultValue?.has_collar ?? undefined,
                        }}
                        animalId={defaultValue?.id ?? undefined}
                        // onCreated={handleSaved}
                        // onSaved={handleSaved}
                        onCancel={close}
                     />
                  </ModalBody>
               </>
            )}
         </ModalContent>
      </Modal>
   );
}
