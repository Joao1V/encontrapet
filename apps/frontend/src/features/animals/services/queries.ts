import { QUERY_KEYS } from '@/config/constants';
import { animalApi } from '@/features/animals/services/api';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useMyAnimalsQuery() {
   const { status } = useSession();

   return useQuery({
      queryKey: [QUERY_KEYS.MY_ANIMALS],
      queryFn: animalApi.listMyAnimals,
      enabled: status === 'authenticated',
   });
}
