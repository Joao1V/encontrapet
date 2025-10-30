import { SESSION_MAX_AGE } from '@encontra-pet/utils';
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
   slug: 'users',
   auth: {
      useAPIKey: true,
      tokenExpiration: SESSION_MAX_AGE,
   },
   admin: {
      useAsTitle: 'name',
   },
   hooks: {
      beforeValidate: [
         ({ data, req, operation }) => {
            if (operation === 'create' && (req.user as any)?.role !== 'admin' && data) {
               data.role = 'user';
            }
            return data;
         },
      ],
   },
   access: {
      admin: ({ req: { user } }) => {
         return (user as any)?.role === 'admin';
      },
      read: ({ req: { user } }) => {
         if ((user as any)?.role === 'admin') return true;
         return {
            id: {
               equals: user?.id,
            },
         };
      },
      create: () => true,
      update: ({ req: { user } }) => {
         if ((user as any)?.role === 'admin') return true;
         return {
            id: {
               equals: user?.id,
            },
         };
      },
      delete: ({ req: { user } }) => {
         return (user as any)?.role === 'admin';
      },
   },
   fields: [
      {
         name: 'role',
         type: 'select',
         required: true,
         defaultValue: 'user',
         options: [
            {
               label: 'Admin',
               value: 'admin',
            },
            {
               label: 'Usuário',
               value: 'user',
            },
         ],
         access: {
            create: ({ req: { user } }) => (user as any)?.role === 'admin',
            update: ({ req: { user } }) => (user as any)?.role === 'admin',
            read: ({ req: { user } }) => (user as any)?.role === 'admin',
         },
         admin: {
            condition: (_data, { user }) => (user as any)?.role === 'admin',
         },
      },
      {
         name: 'email',
         type: 'text',
         required: true,
         access: {
            read: ({ req: { user }, id }) => {
               if ((user as any)?.role === 'admin') return true;
               return user && id ? user.id === id : false;
            },
         },
      },
      {
         name: 'name',
         type: 'text',
         required: true,
      },
      {
         name: 'phone',
         type: 'text',
         access: {
            read: ({ req: { user }, id }) => {
               if ((user as any)?.role === 'admin') return true;
               return user && id ? user.id === id : false;
            },
         },
      },
      {
         name: 'birthDate',
         type: 'date',
         access: {
            read: ({ req: { user }, id }) => {
               if ((user as any)?.role === 'admin') return true;
               return user && id ? user.id === id : false;
            },
         },
         admin: {
            date: {
               pickerAppearance: 'dayOnly',
            },
         },
      },
   ],
};
