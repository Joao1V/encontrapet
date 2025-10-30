import { useMemo } from 'react';

import { QUERY_KEYS } from '@/config/constants';
import { animalApi } from '@/features/animals/services/api';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useMyAnimalsQuery() {
   const { data: session, status } = useSession();
   const userId = useMemo(() => session?.user?.id ?? undefined, [session]);

   return useQuery({
      queryKey: [QUERY_KEYS.MY_ANIMALS],
      queryFn: async () => {
         if (!userId) return undefined;
         return await animalApi.listMyAnimals(userId);
      },
      enabled: status === 'authenticated' && !!userId,
   });
}
