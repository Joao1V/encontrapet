import api, { type PaginateResponse } from '@/lib/axios';
import type { Animal as AnimalPayload, Photo as PayloadPhoto } from '@payload-types';

type Animal = {
   id: string;
   name: string;
   species: AnimalPayload['species'];
   size?: AnimalPayload['size'];
   color?: string | null;
   has_collar?: boolean | null;
   gender?: AnimalPayload['gender'];
   notes?: string | null;
   photos?: PayloadPhoto;
};

export type CreateAnimalInput = Omit<Animal, 'id'>;
export type UpdateAnimalInput = Partial<CreateAnimalInput>;

class AnimalServices {
   async listMyAnimals() {
      return await api.get<PaginateResponse<AnimalPayload[]>>(`/animals/me`);
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
         photos: data.photos,
      };
      return await api.post<Animal, typeof payload>(`/animals`, payload);
   }

   async updateAnimal(id: number, data: UpdateAnimalInput): Promise<Animal> {
      const payload = {
         name: data.name,
         species: data.species,
         size: data.size,
         color: data.color,
         has_collar: data.has_collar,
         gender: data.gender,
         notes: data.notes,
         photos: data.photos,
      };
      return await api.patch<Animal, typeof payload>(`/animals/${id}`, payload);
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
   async uploadAnimalPhotos(animalId: number, payload: any[]) {
      const res = await api.post<PayloadPhoto>(`/photos`, payload);

      return res;
   }
}

export const animalApi = new AnimalServices();
export default AnimalServices;
