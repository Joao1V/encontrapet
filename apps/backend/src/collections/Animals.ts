import type {
   CollectionAfterChangeHook,
   CollectionBeforeChangeHook,
   CollectionConfig,
} from 'payload';

const addUserToAnimal: CollectionBeforeChangeHook = ({ req, data }) => {
   if (!req.user) {
      return data;
   }

   return { ...data, user: req.user.id };
};

const processPhotos: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
   const photosData = req.data?.photos;

   if (!photosData || !Array.isArray(photosData) || photosData.length === 0) {
      return doc;
   }

   const uploadedPhotos = [];

   for (const photoData of photosData) {
      try {
         if (!photoData.data || !photoData.mimetype || !photoData.name) {
            console.warn('Invalid photo data, skipping:', photoData);
            continue;
         }

         const base64Data = photoData.data.replace(/^data:image\/\w+;base64,/, '');
         const buffer = Buffer.from(base64Data, 'base64');

         const photo = await req.payload.create({
            collection: 'photos',
            data: {
               animal: doc.id,
            },
            file: {
               data: buffer,
               mimetype: photoData.mimetype,
               name: photoData.name,
               size: buffer.length,
            },
         });

         uploadedPhotos.push(photo);
      } catch (error) {
         console.error('Error uploading photo:', error);
      }
   }

   console.log(`Uploaded ${uploadedPhotos.length} photos for animal ${doc.id}`);
   return doc;
};

export const Animals: CollectionConfig = {
   slug: 'animals',
   endpoints: [
      {
         path: '/me',
         method: 'get',
         handler: async (req) => {
            try {
               if (!req.user) {
                  return Response.json(
                     {
                        success: false,
                        error: 'Unauthorized',
                     },
                     { status: 401 },
                  );
               }

               const url = req.url || '';
               const { searchParams } = new URL(url, `http://localhost`);
               const page = Number(searchParams.get('page')) || 1;
               const limit = Number(searchParams.get('limit')) || 10;

               const animals = await req.payload.find({
                  collection: 'animals',
                  where: {
                     user: {
                        equals: req.user.id,
                     },
                  },
                  page,
                  limit,
                  sort: '-createdAt',
               });

               return Response.json(animals);
            } catch (error) {
               console.error('Erro ao buscar meus animais:', error);
               return Response.json(
                  {
                     success: false,
                     error: 'Erro ao buscar animais',
                  },
                  { status: 500 },
               );
            }
         },
         openapi: {
            summary: 'Lista animais do usuário autenticado',
            description:
               'Retorna apenas os animais criados pelo usuário logado, ordenados por data de criação (mais recentes primeiro). Requer autenticação via Bearer token.',
            tags: ['Animals'],
            parameters: [
               {
                  name: 'page',
                  in: 'query',
                  description: 'Número da página (padrão: 1)',
                  required: false,
                  schema: {
                     type: 'integer',
                     default: 1,
                     example: 1,
                  },
               },
               {
                  name: 'limit',
                  in: 'query',
                  description: 'Itens por página (padrão: 10)',
                  required: false,
                  schema: {
                     type: 'integer',
                     default: 10,
                     example: 10,
                  },
               },
            ],
            responses: {
               200: {
                  description: 'Lista de animais retornada com sucesso',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              docs: {
                                 type: 'array',
                                 description: 'Array de animais',
                              },
                              totalDocs: {
                                 type: 'integer',
                              },
                              page: {
                                 type: 'integer',
                              },
                              limit: {
                                 type: 'integer',
                              },
                           },
                        },
                     },
                  },
               },
               401: {
                  description: 'Usuário não autenticado',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              success: {
                                 type: 'boolean',
                                 example: false,
                              },
                              error: {
                                 type: 'string',
                                 example: 'Unauthorized',
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   ],
   access: {
      create: ({ req: { user } }) => !!user,
      read: () => true,
      update: ({ req: { user } }) => {
         if (!user) return false;
         return {
            user: {
               equals: user.id,
            },
         };
      },
      delete: ({ req: { user } }) => {
         if (!user) return false;
         return {
            user: {
               equals: user.id,
            },
         };
      },
   },
   admin: {
      useAsTitle: 'name',
   },
   hooks: {
      beforeChange: [addUserToAnimal],
      afterChange: [processPhotos],
   },
   fields: [
      {
         name: 'user',
         type: 'relationship',
         relationTo: 'users',
         required: true,
         admin: {
            readOnly: true,
            position: 'sidebar',
         },
      },
      {
         name: 'name',
         type: 'text',
         required: true,
      },
      {
         name: 'species',
         type: 'select',
         required: true,
         options: [
            { label: 'Cachorro', value: 'dog' },
            { label: 'Gato', value: 'cat' },
         ],
      },
      {
         name: 'size',
         type: 'select',
         options: [
            { label: 'Pequeno', value: 'small' },
            { label: 'Médio', value: 'medium' },
            { label: 'Grande', value: 'large' },
         ],
      },
      {
         name: 'color',
         type: 'text',
      },
      {
         name: 'has_collar',
         type: 'checkbox',
         label: 'Tem coleira?',
         defaultValue: false,
      },
      {
         name: 'gender',
         type: 'select',
         options: [
            { label: 'Macho', value: 'male' },
            { label: 'Fêmea', value: 'female' },
            { label: 'Não sei', value: 'unknown' },
         ],
      },
      {
         name: 'notes',
         type: 'textarea',
         label: 'Notas Adicionais',
      },
      {
         name: 'photos',
         type: 'array',
         label: 'Fotos (Base64)',
         admin: {
            hidden: true,
            description: 'Array de objetos com data (base64), mimetype e name',
         },
         fields: [
            {
               name: 'data',
               type: 'textarea',
               required: true,
            },
            {
               name: 'mimetype',
               type: 'text',
               required: true,
            },
            {
               name: 'name',
               type: 'text',
               required: true,
            },
         ],
      },
   ],
};
