import type { AnimalsType } from '@/features/publish/schema/animals.schema';
import api, { type PaginateResponse } from '@/lib/axios';
import type { Animal as AnimalPayload, Photo as PayloadPhoto } from '@payload-types';

export type Animal = AnimalPayload & {
   photos?: PayloadPhoto[];
};

export type CreateAnimalInput = Omit<AnimalsType, 'id'>;

export type UpdateAnimalInput = Partial<CreateAnimalInput>;

class AnimalServices {
   async listMyAnimals() {
      return await api.get<PaginateResponse<AnimalPayload[]>>(`/animals/me`);
   }

   async createAnimal(data: CreateAnimalInput) {
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

   async updateAnimal(id: number, data: UpdateAnimalInput) {
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

   async deleteAnimal(id: number) {
      try {
         await api.delete(`/animals/${id}`, {});
         return true;
      } catch (e) {
         return false;
      }
   }
}

export const animalApi = new AnimalServices();
export default AnimalServices;
