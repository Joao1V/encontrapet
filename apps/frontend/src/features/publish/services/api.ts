import type { PublicationType } from '@/features/publish/schema/publications.schema';
import api, { type PaginateResponse } from '@/lib/axios/index';
import type {
   Animal as PayloadAnimal,
   Location as PayloadLocation,
   Photo as PayloadPhoto,
   Publication as PayloadPublication,
   User as PayloadUser,
} from '@payload-types';

// Types for Publications (reuse unions for type/status)
export type Publication = Omit<PayloadPublication, 'animal' | 'user' | 'location'> & {
   animal: PayloadAnimal;
   user: PayloadUser;
   location: PayloadLocation;
   photos?: PayloadPhoto;
};

class PublishServices {
   async listPosts() {
      return await api.get<PaginateResponse<Publication[]>>(`/publications`, { limit: 0 });
   }

   async listMyPosts() {
      return await api.get<PaginateResponse<Publication[]>>(`/publications/me`);
   }

   // Publications
   async createPublication(payload: PublicationType): Promise<Publication> {
      return await api.post<Publication, typeof payload>(`/publications`, payload);
   }
}

export const publishApi = new PublishServices();
export default PublishServices;
