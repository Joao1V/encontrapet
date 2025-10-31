import api, { type PaginateResponse } from '@/lib/axios';
import type { Photo as PayloadPhoto } from '@payload-types';

export type PhotoInput = {
   url: string;
   filename: string;
   filesize: number;
   width: number;
   height: number;
   mimeType: string;
};

class PhotosServices {
   async uploadPhotos(payload: PhotoInput[]) {
      const res = await api.post<PayloadPhoto>(`/photos`, payload);
      return res;
   }

   async delete(id: number) {
      try {
         await api.delete(`/photos/${id}`, {});
         return true;
      } catch (e) {
         return false;
      }
   }

   async getPhoto(id: number) {
      return await api.get<PayloadPhoto>(`/photos/${id}`);
   }

   async listPhotos() {
      return await api.get<PaginateResponse<PayloadPhoto[]>>(`/photos`);
   }
}

export const photosServices = new PhotosServices();
export default PhotosServices;
