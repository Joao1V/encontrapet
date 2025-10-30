import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type Animal, publishApi } from './api';

export const publishKeys = {
   animals: ['publish', 'animals'] as const,
};

async function fetchAnimals(): Promise<Animal[]> {
   return publishApi.listAnimals();
}

export function useAnimals(
   options?: Pick<UseQueryOptions<Animal[], Error>, 'enabled'>,
): UseQueryResult<Animal[], Error> {
   return useQuery({
      queryKey: publishKeys.animals,
      queryFn: fetchAnimals,
      enabled: options?.enabled,
   });
}

export function usePostsQuery() {
   return useQuery({
      queryKey: ['post'],
      queryFn: async () => {
         const r = await publishApi.listPosts();
         console.log(r);
         return r;
      },
   });
}
