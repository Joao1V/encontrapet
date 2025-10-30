import api from '@/lib/axios';
import type { Animal as PayloadAnimal, Photo as PayloadPhoto } from '@payload-types';

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

class AnimalServices {
   async listMyAnimals(userId: string): Promise<Animal[]> {
      const res = await api.get<{ docs: Animal[] }>(`/animals`, {
         limit: 0,
         where: { user: { equals: userId } },
      });
      return res?.docs ?? [];
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
   async uploadAnimalPhotos(animalId: number, files: File[]): Promise<PayloadPhoto[]> {
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
}

export const animalApi = new AnimalServices();
export default AnimalServices;
