import type { PublicationType } from '@/features/publish/schema/publications.schema';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { publishApi } from './api';

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
