'use client';

import { Checkbox, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { GENDER_OPTIONS, SIZE_OPTIONS, SPECIES_OPTIONS } from '@encontra-pet/utils';

import { QUERY_KEYS } from '@/config/constants';
import { useCreateAnimal, useUpdateAnimal } from '@/features/animals/services';
import { getFieldErrorProps } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import type { AnimalsType } from '../schema/animals.schema';
import PhotoDropzone, { type PhotoItem } from './photo-dropzone';

type AnimalFormProps = {
   id: string;
   initial?: Partial<AnimalsType>;
   animalId?: number;
   onCreated?: (animal: { id: number; name: string }) => void;
   onSaved?: (animal: { id: number; name: string }) => void;
   onCancel: () => void;
   photos?: { id: number; url: string }[];
};

export default function AnimalForm({ animalId, onCreated, onSaved, id, photos }: AnimalFormProps) {
   const { control, handleSubmit, setValue } = useFormContext<AnimalsType>();
   const qc = useQueryClient();
   const createAnimal = useCreateAnimal();
   const updateAnimal = useUpdateAnimal();

   const handlePhotosChange = (updated: PhotoItem[]) => {
      console.log(updated);
      setValue('photos', updated, { shouldValidate: true });
   };

   const onSubmit = async (data: AnimalsType) => {
      const payload = data;
      if (animalId) {
         const updated = await updateAnimal.mutateAsync({ id: animalId, data: payload });
         onSaved?.({ id: updated.id, name: updated.name });
      } else {
         const created = await createAnimal.mutateAsync(payload);
         onCreated?.({ id: created.id, name: created.name });
      }
      await qc.invalidateQueries({ queryKey: [QUERY_KEYS.MY_ANIMALS] });
   };

   return (
      <form
         id={id}
         className="flex flex-col gap-6"
         onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
      >
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
                  <PhotoDropzone
                     files={(field.value as unknown as PhotoItem[]) ?? []}
                     onChange={handlePhotosChange}
                     defaultValue={photos}
                  />
               )}
            />
         </div>
      </form>
   );
}
