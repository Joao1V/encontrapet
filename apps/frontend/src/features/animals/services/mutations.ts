import type { AnimalsType } from '@/features/publish/schema/animals.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { animalApi, type CreateAnimalInput } from './api';

export function useCreateAnimal() {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: async (data: CreateAnimalInput) => animalApi.createAnimal(data),
      onSuccess: async () => {},
   });
}
export function useDeleteAnimal() {
   const qc = useQueryClient();
   return useMutation<boolean, Error, number>({
      mutationFn: async (id: number) => animalApi.deleteAnimal(id),
      onSuccess: () => {},
   });
}

export function useUpdateAnimal() {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: async (vars: { id: number; data: Partial<CreateAnimalInput> }) => {
         return await animalApi.updateAnimal(vars.id, vars.data);
      },
      onSuccess: async () => {},
   });
}
