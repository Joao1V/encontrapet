'use client';

import { Button, Checkbox, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { GENDER_OPTIONS, SIZE_OPTIONS, SPECIES_OPTIONS } from '@encontra-pet/utils';

import {
   useCreateAnimal,
   useUpdateAnimal,
   useUploadPhotoAnimal,
} from '@/features/animals/services';
import { getFieldErrorProps } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { AnimalsSchema, type AnimalsType } from '../schema/animals.schema';
import PhotoDropzone from './photo-dropzone';

type Props = {
   initial?: Partial<AnimalsType>;
   animalId?: string;
   onCreated?: (animal: { id: string; name: string }) => void;
   onSaved?: (animal: { id: string; name: string }) => void;
   onCancel: () => void;
};

export default function AnimalForm({ initial, animalId, onCreated, onSaved, onCancel }: Props) {
   const {
      control,
      handleSubmit,
      setValue,
      formState: { isSubmitting },
   } = useForm<AnimalsType>({
      resolver: zodResolver(AnimalsSchema),
      defaultValues: {
         name: initial?.name ?? undefined,
         color: initial?.color ?? undefined,
         species: initial?.species ?? undefined,
         has_collar: initial?.has_collar ?? false,
         size: initial?.size ?? undefined,
         gender: initial?.gender ?? undefined,
         notes: initial?.notes ?? undefined,
      },
   });
   const createAnimal = useCreateAnimal();
   const updateAnimal = useUpdateAnimal();
   const uploadPhotoAnimal = useUploadPhotoAnimal();

   const handlePhotosChange = (updated: File[]) => {
      setValue('photos', updated, { shouldValidate: true });
   };

   const onSubmit = async (data: AnimalsType) => {
      const { photos, ...payload } = data;
      if (animalId) {
         const updated = await updateAnimal.mutateAsync({ id: animalId, data: payload });
         if (photos?.length) {
            await uploadPhotoAnimal.mutateAsync({ id: Number(updated.id), photos });
         }
         onSaved?.({ id: updated.id, name: updated.name });
      } else {
         const created = await createAnimal.mutateAsync(payload);
         if (photos?.length) {
            await uploadPhotoAnimal.mutateAsync({ id: Number(created.id), photos });
         }
         onCreated?.({ id: created.id, name: created.name });
      }
   };

   return (
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
         <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
               <Input
                  label="Nome do animal"
                  placeholder="Ex.: Rex, Mimi..."
                  {...field}
                  {...getFieldErrorProps(fieldState)}
                  isRequired
               />
            )}
         />

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
               name="species"
               control={control}
               render={({ field, fieldState }) => (
                  <Select
                     label="Espécie"
                     selectedKeys={field.value ? [field.value] : []}
                     onSelectionChange={(k) => field.onChange(Array.from(k)[0])}
                     {...getFieldErrorProps(fieldState)}
                     isRequired
                  >
                     {SPECIES_OPTIONS.map((o) => (
                        <SelectItem key={o.value}>{o.label}</SelectItem>
                     ))}
                  </Select>
               )}
            />

            <Controller
               name="size"
               control={control}
               render={({ field, fieldState }) => (
                  <Select
                     label="Porte"
                     selectedKeys={field.value ? [field.value] : []}
                     onSelectionChange={(k) => field.onChange(Array.from(k)[0])}
                     {...getFieldErrorProps(fieldState)}
                     placeholder="Opcional"
                  >
                     {SIZE_OPTIONS.map((o) => (
                        <SelectItem key={o.value}>{o.label}</SelectItem>
                     ))}
                  </Select>
               )}
            />
         </div>

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
               name="color"
               control={control}
               render={({ field, fieldState }) => (
                  <Input
                     label="Cor"
                     placeholder="Ex.: Branco, Caramelo..."
                     {...field}
                     {...getFieldErrorProps(fieldState)}
                  />
               )}
            />

            <Controller
               name="gender"
               control={control}
               render={({ field, fieldState }) => (
                  <Select
                     label="Sexo"
                     selectedKeys={field.value ? [field.value] : []}
                     onSelectionChange={(k) => field.onChange(Array.from(k)[0])}
                     {...getFieldErrorProps(fieldState)}
                     placeholder="Opcional"
                  >
                     {GENDER_OPTIONS.map((o) => (
                        <SelectItem key={o.value}>{o.label}</SelectItem>
                     ))}
                  </Select>
               )}
            />
         </div>

         <Controller
            name="has_collar"
            control={control}
            render={({ field }) => (
               <Checkbox isSelected={field.value} onValueChange={field.onChange}>
                  Tem coleira?
               </Checkbox>
            )}
         />

         <Controller
            name="notes"
            control={control}
            render={({ field, fieldState }) => (
               <Textarea
                  label="Notas adicionais"
                  minRows={3}
                  placeholder="Observações relevantes..."
                  {...field}
                  {...getFieldErrorProps(fieldState)}
               />
            )}
         />

         {/* Fotos */}
         <div>
            <p className="mb-2 font-medium text-sm">Selecione até 3 fotos do seu bichinho</p>
            <Controller
               name="photos"
               control={control}
               render={({ field }) => (
                  <PhotoDropzone files={field.value ?? []} onChange={handlePhotosChange} />
               )}
            />
         </div>

         <div className="flex justify-between">
            <Button variant="bordered" onPress={onCancel}>
               Voltar
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
               Salvar animal
            </Button>
         </div>
      </form>
   );
}
