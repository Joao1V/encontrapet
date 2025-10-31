import { useEffect, useId } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import type { UseDisclosureReturn } from '@heroui/use-disclosure';

import type { Animal } from '@/features/animals/services';
import AnimalForm from '@/features/publish/components/animal-form';
import { AnimalsSchema, type AnimalsType } from '@/features/publish/schema/animals.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

type ModalEditAnimalProps = UseDisclosureReturn & {
   isEditing?: boolean;
   defaultValue?: Partial<Animal> | null;
};

export function ModalEditAnimal(props: ModalEditAnimalProps) {
   const { isOpen, onOpenChange, isEditing, defaultValue } = props;
   const formId = useId();

   const methods = useForm<AnimalsType>({
      resolver: zodResolver(AnimalsSchema),
   });

   useEffect(() => {
      if (defaultValue) {
         methods.reset({
            name: defaultValue?.name ?? undefined,
            color: defaultValue?.color ?? undefined,
            species: defaultValue?.species ?? undefined,
            has_collar: defaultValue?.has_collar ?? false,
            size: defaultValue?.size ?? undefined,
            gender: defaultValue?.gender ?? undefined,
            notes: defaultValue?.notes ?? undefined,
         });
      }
   }, [defaultValue]);

   return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
         <ModalContent>
            {(close) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">
                     {isEditing ? `Editar animal` : `Novo animal`}
                  </ModalHeader>
                  <ModalBody>
                     <FormProvider {...methods}>
                        <AnimalForm
                           id={formId}
                           animalId={defaultValue?.id ?? undefined}
                           photos={defaultValue?.photos
                              ?.map((i) => ({ url: i.url as string, id: i.id }))
                              .filter(Boolean)}
                           onCancel={close}
                           onSaved={close}
                        />
                     </FormProvider>
                  </ModalBody>
                  <ModalFooter>
                     <Button
                        color="primary"
                        type="submit"
                        isLoading={methods.formState.isSubmitting}
                        form={formId}
                     >
                        Salvar animal
                     </Button>
                     <Button variant="light" onPress={close}>
                        Fechar
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   );
}
