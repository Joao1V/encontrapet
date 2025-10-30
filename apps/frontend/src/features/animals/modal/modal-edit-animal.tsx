import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import type { UseDisclosureReturn } from '@heroui/use-disclosure';

type ModalEditAnimalProps = UseDisclosureReturn & {};

export function ModalEditAnimal(props: ModalEditAnimalProps) {
   const { isOpen, onOpen, onOpenChange, onClose } = props;

   return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
         <ModalContent>
            {(close) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">
                     {/*{editing ? `Editar animal` : `Novo animal`}*/}
                     Editar animal
                  </ModalHeader>
                  <ModalBody>
                     {/*<AnimalForm*/}
                     {/*   initial={editing ?? undefined}*/}
                     {/*   animalId={editing?.id}*/}
                     {/*   onCreated={handleSaved}*/}
                     {/*   onSaved={handleSaved}*/}
                     {/*   onCancel={close}*/}
                     {/*/>*/}
                  </ModalBody>
               </>
            )}
         </ModalContent>
      </Modal>
   );
}
