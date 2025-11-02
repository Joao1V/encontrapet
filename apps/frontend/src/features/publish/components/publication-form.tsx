'use client';
import { Button, Input, Textarea } from '@heroui/react';

import { QUERY_KEYS } from '@/config/constants';
import { useCreatePost } from '@/features/publish/services';
import { GoogleAutocomplete } from '@/lib/google';
import { getFieldErrorProps } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { PublicationsSchema, type PublicationType } from '../schema/publications.schema';

type Props = {
   defaultType: 'lost' | 'found';
   animalId?: number;
   isSubmitting?: boolean;
};

export default function PublicationForm({ defaultType, animalId, isSubmitting }: Props) {
   const createPost = useCreatePost();
   const qc = useQueryClient();

   const { control, setValue, handleSubmit, getValues } = useForm<PublicationType>({
      resolver: zodResolver(PublicationsSchema),
      defaultValues: {
         title: '',
         description: '',
         status: 'open',
         type: defaultType,
         animal: Number(animalId),
         disappearance_date: '',
      },
   });

   const onSubmit = async (data: PublicationType) => {
      console.log(data);
      await createPost.mutateAsync(data);
      await qc.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
   };

   return (
      <form
         className="flex flex-col gap-6"
         onSubmit={handleSubmit(onSubmit, (er) => console.log(er))}
      >
         <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
               <Input
                  label="Título"
                  placeholder="Ex.: Cachorro perdido no bairro X"
                  {...field}
                  {...getFieldErrorProps(fieldState)}
                  isRequired
               />
            )}
         />

         <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
               <Textarea
                  label="Descrição"
                  minRows={4}
                  placeholder="Conte detalhes relevantes (características, como aconteceu, contato, etc.)"
                  {...field}
                  {...getFieldErrorProps(fieldState)}
               />
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
            name="street"
            control={control}
            render={({ field, fieldState }) => (
               <GoogleAutocomplete
                  {...getFieldErrorProps(fieldState)}
                  label={'Localização'}
                  onSelect={(place) => {
                     const { lat, lng } = place;
                     console.log(place);

                     if (place) {
                        setValue('street', place.street);
                        setValue('district', place.district);
                        setValue('city', place.city);
                        setValue('state', place.state);
                        setValue('coordinates', [lat, lng]);
                     }
                     console.log(getValues());
                  }}
                  onClear={() => {}}
                  placeholder={'Digite o local'}
               />
            )}
         />

         <div className="flex gap-3 pt-2">
            <Button type="submit" color="primary" isLoading={isSubmitting} fullWidth>
               Publicar
            </Button>
         </div>
      </form>
   );
}
