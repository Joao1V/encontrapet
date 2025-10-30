import type { PublicationType } from '@/features/publish/schema/publications.schema';
import api, { type PaginateResponse } from '@/lib/axios/index';
import type {
   Animal as PayloadAnimal,
   Location as PayloadLocation,
   Photo as PayloadPhoto,
   Publication as PayloadPublication,
   User as PayloadUser,
} from '@payload-types';

// Types for Animals (frontend-friendly ids, reuse enums from payload types)
export type Animal = {
   id: string;
   name: string;
   species: PayloadAnimal['species'];
   size?: PayloadAnimal['size'];
   color?: string | null;
   has_collar?: boolean | null;
   gender?: PayloadAnimal['gender'];
   notes?: string | null;
};

// Types for Publications (reuse unions for type/status)
export type Publication = Omit<PayloadPublication, 'animal' | 'user' | 'location'> & {
   animal: PayloadAnimal;
   user: PayloadUser;
   location: PayloadLocation;
   photos?: PayloadPhoto;
};

class PublishServices {
   async listAnimals(): Promise<Animal[]> {
      try {
         const res = await api.get<{ docs: Animal[] }>(`/animals`, { limit: 0 });
         return res?.docs ?? [];
      } catch {
         return [];
      }
   }

   async listPosts() {
      return await api.get<PaginateResponse<Publication[]>>(`/publications`, { limit: 0 });
   }

   async listMyPosts(userId: string) {
      return await api.get<PaginateResponse<Publication[]>>(`/publications`, {
         limit: 0,
         where: { user: { equals: userId } },
      } as any);
   }

   // Publications
   async createPublication(payload: PublicationType): Promise<Publication> {
      return await api.post<Publication, typeof payload>(`/publications`, payload);
   }
}

export const publishApi = new PublishServices();
export default PublishServices;
