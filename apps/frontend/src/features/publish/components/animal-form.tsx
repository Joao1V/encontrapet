'use client';

import { Button, Checkbox, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { GENDER_OPTIONS, SIZE_OPTIONS, SPECIES_OPTIONS } from '@encontra-pet/utils';

import { getFieldErrorProps } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { AnimalsSchema, type AnimalsType } from '../schema/animals.schema';
import { publishApi } from '../services/api';
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
         disappearance_date: initial?.disappearance_date ?? undefined,
         has_collar: initial?.has_collar ?? false,
         size: initial?.size ?? undefined,
         gender: initial?.gender ?? undefined,
         notes: initial?.notes ?? undefined,
      },
   });

   const handlePhotosChange = (updated: File[]) => {
      setValue('photos', updated, { shouldValidate: true });
   };

   const onSubmit = async (data: AnimalsType) => {
      const { photos, ...payload } = data;
      if (animalId) {
         const updated = await publishApi.updateAnimal(animalId, payload);
         if (photos?.length) {
            await publishApi.uploadAnimalPhotos(updated.id, photos);
         }
         onSaved?.({ id: updated.id, name: updated.name });
      } else {
         const created = await publishApi.createAnimal(payload);
         if (photos?.length) {
            await publishApi.uploadAnimalPhotos(created.id, photos);
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
            name="disappearance_date"
            control={control}
            render={({ field, fieldState }) => (
               <Input
                  type="date"
                  label="Data de Desaparecimento/Encontro"
                  {...field}
                  {...getFieldErrorProps(fieldState)}
               />
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
            <p className="mb-2 font-medium text-sm">Fotos (até 3)</p>
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

async function fileToDataUrl(file: File) {
   const reader = new FileReader();
   const dataUrl = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
   });
   return dataUrl;
}
