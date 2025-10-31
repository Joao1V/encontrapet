import { photosServices } from '@/features/photos/services/api';
import { useMutation } from '@tanstack/react-query';

export function useDeletePhoto(options: { onSuccess?: () => void }) {
   return useMutation({
      mutationFn: photosServices.delete,
      onSuccess: options?.onSuccess,
   });
}
