import type { PublicationType } from '@/features/publish/schema/publications.schema';
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { publishApi, type Animal, type CreateAnimalInput } from './api';
import { publishKeys } from './queries';

export function useDeleteAnimal(): UseMutationResult<boolean, Error, string> {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: async (id: string) => publishApi.deleteAnimal(id),
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: publishKeys.animals });
      },
   });
}

export function useUpdateAnimal(): UseMutationResult<
   Animal,
   Error,
   { id: string; data: Partial<CreateAnimalInput> }
> {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: async (vars: { id: string; data: Partial<CreateAnimalInput> }) =>
         publishApi.updateAnimal(vars.id, vars.data),
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: publishKeys.animals });
      },
   });
}

export function useCreatePost() {
   const router = useRouter();

   return useMutation({
      mutationFn: async (variables: PublicationType) => {
         return await publishApi.createPublication(variables);
      },
      onSuccess: () => {
         router.push('/feed');
      },
   });
}
