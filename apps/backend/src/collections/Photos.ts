import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CollectionConfig } from 'payload';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Photos: CollectionConfig = {
   slug: 'photos',
   access: {
      read: () => true,
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
