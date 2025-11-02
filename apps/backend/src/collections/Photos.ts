import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CollectionConfig } from 'payload';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Photos: CollectionConfig = {
   slug: 'photos',
   access: {
      read: () => true,
      delete: async ({ req, id }) => {
         if (!req.user) return false;

         if (req.user.collection === 'users' && req.user.roles?.includes('admin')) {
            return true;
         }

         const photo = await req.payload.findByID({
            collection: 'photos',
            id: id as string,
            depth: 2,
         });

         if (photo.animal && typeof photo.animal === 'object' && 'user' in photo.animal) {
            const animalUserId = typeof photo.animal.user === 'object'
               ? photo.animal.user.id
               : photo.animal.user;
            return animalUserId === req.user.id;
         }

         if (photo.publication && typeof photo.publication === 'object' && 'user' in photo.publication) {
            const publicationUserId = typeof photo.publication.user === 'object'
               ? photo.publication.user.id
               : photo.publication.user;
            return publicationUserId === req.user.id;
         }

         return false;
      },
   },
   upload: {
      mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
   },
   admin: {
      useAsTitle: 'filename',
   },
   fields: [
      {
         name: 'publication',
         type: 'relationship',
         relationTo: 'publications',
         required: false,
      },
      {
         name: 'animal',
         type: 'relationship',
         relationTo: 'animals',
         required: false,
      },
   ],
};
