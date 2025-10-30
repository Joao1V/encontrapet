import type { AnimalsType } from '@/features/publish/schema/animals.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Animal, animalApi, type CreateAnimalInput } from './api';

export function useCreateAnimal() {
   const qc = useQueryClient();
   return useMutation<Animal, Error, CreateAnimalInput>({
      mutationFn: async (data: CreateAnimalInput) => animalApi.createAnimal(data),
      onSuccess: async () => {},
   });
}
export function useDeleteAnimal() {
   const qc = useQueryClient();
   return useMutation<boolean, Error, string>({
      mutationFn: async (id: string) => animalApi.deleteAnimal(id),
      onSuccess: () => {},
   });
}

export function useUpdateAnimal() {
   const qc = useQueryClient();
   return useMutation<Animal, Error, { id: string; data: Partial<CreateAnimalInput> }>({
      mutationFn: async (vars) => {
         return await animalApi.updateAnimal(vars.id, vars.data);
      },
      onSuccess: async () => {},
   });
}

export function useUploadPhotoAnimal() {
   const qc = useQueryClient();
   return useMutation<{}, Error, { id: number; photos: AnimalsType['photos'] }>({
      mutationFn: async (variables) => {
         const { id, photos } = variables;
         await animalApi.uploadAnimalPhotos(id, photos);
         return {};
      },
   });
}
