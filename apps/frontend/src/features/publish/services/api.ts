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

export type CreateAnimalInput = Omit<Animal, 'id'>;
export type UpdateAnimalInput = Partial<CreateAnimalInput>;

// Types for Publications (reuse unions for type/status)
export interface Publication extends Omit<PayloadPublication, 'animal' | 'user' | 'location'> {
   animal: PayloadAnimal | null;
   user: PayloadUser;
   location: PayloadLocation;
   photos?: PayloadPhoto;
}

class PublishServices {
   async listAnimals(): Promise<Animal[]> {
      try {
         const res = await api.get<{ docs: Animal[] }>(`/animals`, { limit: 0 });
         return res?.docs ?? [];
      } catch {
         return [];
      }
   }

   async listMyAnimals(userId: string): Promise<Animal[]> {
      try {
         // NOTE: Backend currently may not support ownership on animals; this filters by user if available.
         const res = await api.get<{ docs: Animal[] }>(`/animals`, {
            limit: 0,
            where: { user: { equals: userId } },
         } as any);
         return res?.docs ?? [];
      } catch {
         // fallback: list all
         return this.listAnimals();
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

   async createAnimal(data: CreateAnimalInput): Promise<Animal> {
      const payload = {
         name: data.name,
         species: data.species,
         size: data.size,
         color: data.color,
         has_collar: data.has_collar ?? false,
         gender: data.gender,
         notes: data.notes,
      };
      return await api.post<Animal, typeof payload>(`/animals`, payload);
   }

   async updateAnimal(id: string, data: UpdateAnimalInput): Promise<Animal> {
      const payload = {
         name: data.name,
         species: data.species,
         size: data.size,
         color: data.color,
         has_collar: data.has_collar,
         gender: data.gender,
         notes: data.notes,
      };
      return await api.post<Animal, typeof payload>(`/animals/${id}`, payload);
   }

   async deleteAnimal(id: string): Promise<boolean> {
      try {
         await api.delete(`/animals/${id}`, {});
         return true;
      } catch (e) {
         return false;
      }
   }

   // Photos
   async uploadAnimalPhotos(animalId: string, files: File[]): Promise<PayloadPhoto[]> {
      const uploaded: PayloadPhoto[] = [];
      for (const file of files) {
         const fd = new FormData();
         fd.append('image', file);
         fd.append('animal', animalId);
         const res = await api.post<PayloadPhoto, FormData>(`/photos`, fd);
         uploaded.push(res);
      }
      return uploaded;
   }

   // Publications
   async createPublication(payload: PublicationType): Promise<Publication> {
      return await api.post<Publication, typeof payload>(`/publications`, payload);
   }
}

export const publishApi = new PublishServices();
export default PublishServices;
