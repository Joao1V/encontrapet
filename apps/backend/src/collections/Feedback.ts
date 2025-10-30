import type { CollectionConfig } from 'payload';

export const Feedback: CollectionConfig = {
   slug: 'feedback',
   fields: [
      {
         name: 'reunited',
         type: 'checkbox',
         label: 'Animal foi encontrado/reunido?',
         defaultValue: false,
      },
      {
         name: 'comment',
         type: 'textarea',
         label: 'Comentário',
      },
      {
         name: 'publication',
         type: 'relationship',
         relationTo: 'publications',
         required: true,
      },
      {
         name: 'user',
         type: 'relationship',
         relationTo: 'users',
         required: true,
      },
   ],
};
