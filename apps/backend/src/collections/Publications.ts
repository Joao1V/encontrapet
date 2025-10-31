import type {
   Access,
   CollectionAfterChangeHook,
   CollectionAfterReadHook,
   CollectionBeforeChangeHook,
   CollectionBeforeDeleteHook,
   CollectionConfig,
} from 'payload';

const addUserToPublication: CollectionBeforeChangeHook = ({ req, data }) => {
   if (!req.user) {
      return data;
   }

   return { ...data, user: req.user.id };
};

const logIncomingData: CollectionBeforeChangeHook = ({ data }) => {
   console.log('--- DADOS RECEBIDOS DO FRONT-END ---');
   console.log(data);
   console.log('------------------------------------');

   return data;
};

const createLocationFromData: CollectionBeforeChangeHook = async ({ req, data }) => {
   if (data.locationData && typeof data.locationData === 'object') {
      try {
         const { district, city, state, coordinates } = data.locationData;

         const createdLocation = await req.payload.create({
            collection: 'locations',
            data: {
               district,
               city,
               state,
               coordinates,
            },
         });

         const { locationData, ...restData } = data;
         return {
            ...restData,
            location: createdLocation.id,
         };
      } catch (error) {
         console.error('Erro ao criar location:', error);
         throw new Error('Falha ao criar localização');
      }
   }

   return data;
};

const debugLogHeaders: Access = ({ req }) => {
   console.log('--- CABEÇALHOS DA REQUISIÇÃO RECEBIDA ---');
   console.log(Object.fromEntries(req.headers));
   console.log('----------------------------------------');

   return true;
};

const addRelationshipIds: CollectionAfterReadHook = ({ doc }) => {
   const result = { ...doc };

   if (typeof doc.animal === 'number') {
      result.animal_id = doc.animal;
   }

   if (typeof doc.location === 'number') {
      result.location_id = doc.location;
   }

   if (typeof doc.user === 'number') {
      result.user_id = doc.user;
   }

   return result;
};

const processPhotos: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
   const photosData = req.data?.photos;

   if (!photosData || !Array.isArray(photosData) || photosData.length === 0) {
      return doc;
   }

   setImmediate(async () => {
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
                  publication: doc.id,
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

      console.log(`Uploaded ${uploadedPhotos.length} photos for publication ${doc.id}`);
   });

   return doc;
};

const deletePhotos: CollectionBeforeDeleteHook = async ({ req, id }) => {
   const photos = await req.payload.find({
      collection: 'photos',
      where: {
         publication: {
            equals: id,
         },
      },
      limit: 1000,
   });

   for (const photo of photos.docs) {
      try {
         await req.payload.delete({
            collection: 'photos',
            id: photo.id,
         });
      } catch (error) {
         console.error(`Error deleting photo ${photo.id}:`, error);
      }
   }

   console.log(`Deleted ${photos.docs.length} photos for publication ${id}`);
};

export const Publications: CollectionConfig = {
   slug: 'publications',
   endpoints: [
      {
         path: '/',
         method: 'get',
         handler: async (req) => {
            try {
               const url = req.url || '';
               const { searchParams } = new URL(url, `http://localhost`);
               const page = Number(searchParams.get('page')) || 1;
               const limit = Number(searchParams.get('limit')) || 10;

               const publications = await req.payload.find({
                  collection: 'publications',
                  page,
                  limit,
                  depth: 2,
                  sort: '-createdAt',
               });

               const publicationsWithPhotos = await Promise.all(
                  publications.docs.map(async (publication) => {
                     const photos = await req.payload.find({
                        collection: 'photos',
                        where: {
                           publication: {
                              equals: publication.id,
                           },
                        },
                        limit: 100,
                     });

                     let animalPhotos: any[] = [];
                     if (publication.animal && typeof publication.animal === 'object' && publication.animal.id) {
                        const animalPhotosResult = await req.payload.find({
                           collection: 'photos',
                           where: {
                              animal: {
                                 equals: publication.animal.id,
                              },
                           },
                           limit: 100,
                        });
                        animalPhotos = animalPhotosResult.docs;
                     }

                     return {
                        ...publication,
                        photos: photos.docs,
                        animal: publication.animal && typeof publication.animal === 'object'
                           ? {
                              ...publication.animal,
                              photos: animalPhotos,
                           }
                           : publication.animal,
                     };
                  }),
               );

               return Response.json({
                  ...publications,
                  docs: publicationsWithPhotos,
               });
            } catch (error) {
               console.error('Erro ao listar publicações:', error);
               return Response.json(
                  {
                     success: false,
                     error: 'Erro ao listar publicações',
                  },
                  { status: 500 },
               );
            }
         },
      },
      {
         path: '/search',
         method: 'get',
         handler: async (req) => {
            try {
               const { searchParams } = new URL(req.url);
               const type = searchParams.get('type');
               const district = searchParams.get('district');
               const text = searchParams.get('text');
               const page = Number(searchParams.get('page')) || 1;
               const limit = Number(searchParams.get('limit')) || 10;

               const where: any = { and: [] };

               if (type) {
                  where.and.push({ type: { equals: type } });
               }

               if (district) {
                  const locations = await req.payload.find({
                     collection: 'locations',
                     where: {
                        district: { equals: district },
                     },
                     limit: 1000,
                  });

                  const locationIds = locations.docs.map((loc) => loc.id);
                  if (locationIds.length > 0) {
                     where.and.push({ location: { in: locationIds } });
                  }
               }

               if (text) {
                  where.and.push({
                     or: [{ title: { contains: text } }, { description: { contains: text } }],
                  });
               }

               const finalWhere = where.and.length > 0 ? where : {};

               const publications = await req.payload.find({
                  collection: 'publications',
                  where: finalWhere,
                  page,
                  limit,
                  depth: 2,
               });

               const publicationsWithPhotos = await Promise.all(
                  publications.docs.map(async (publication) => {
                     const photos = await req.payload.find({
                        collection: 'photos',
                        where: {
                           publication: {
                              equals: publication.id,
                           },
                        },
                        limit: 100,
                     });

                     let animalPhotos: any[] = [];
                     if (publication.animal && typeof publication.animal === 'object' && publication.animal.id) {
                        const animalPhotosResult = await req.payload.find({
                           collection: 'photos',
                           where: {
                              animal: {
                                 equals: publication.animal.id,
                              },
                           },
                           limit: 100,
                        });
                        animalPhotos = animalPhotosResult.docs;
                     }

                     return {
                        ...publication,
                        photos: photos.docs,
                        animal: publication.animal && typeof publication.animal === 'object'
                           ? {
                              ...publication.animal,
                              photos: animalPhotos,
                           }
                           : publication.animal,
                     };
                  }),
               );

               return Response.json({
                  ...publications,
                  docs: publicationsWithPhotos,
               });
            } catch (error) {
               console.error('Erro na busca:', error);
               return Response.json(
                  {
                     success: false,
                     error: 'Erro ao buscar publicações',
                  },
                  { status: 500 },
               );
            }
         },
         openapi: {
            summary: 'Busca avançada de publicações',
            description:
               'Busca publicações com filtros combinados por tipo, bairro e texto. Retorna resultados paginados com dados de relacionamentos populados (animal, location, user).',
            tags: ['Publications'],
            parameters: [
               {
                  name: 'type',
                  in: 'query',
                  description: 'Filtra por tipo de publicação',
                  required: false,
                  schema: {
                     type: 'string',
                     enum: ['lost', 'found', 'adoption'],
                     example: 'lost',
                  },
               },
               {
                  name: 'district',
                  in: 'query',
                  description: 'Filtra por bairro (deve corresponder exatamente ao cadastrado)',
                  required: false,
                  schema: {
                     type: 'string',
                     example: 'Vila Mariana',
                  },
               },
               {
                  name: 'text',
                  in: 'query',
                  description: 'Busca texto no título e descrição da publicação',
                  required: false,
                  schema: {
                     type: 'string',
                     example: 'gato branco',
                  },
               },
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
                  description: 'Publicações encontradas com sucesso',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              docs: {
                                 type: 'array',
                                 items: {
                                    type: 'object',
                                    description:
                                       'Objeto da publicação com relacionamentos populados',
                                 },
                              },
                              totalDocs: {
                                 type: 'integer',
                                 description: 'Total de documentos encontrados',
                              },
                              limit: {
                                 type: 'integer',
                                 description: 'Limite de itens por página',
                              },
                              totalPages: {
                                 type: 'integer',
                                 description: 'Total de páginas',
                              },
                              page: {
                                 type: 'integer',
                                 description: 'Página atual',
                              },
                              pagingCounter: {
                                 type: 'integer',
                              },
                              hasPrevPage: {
                                 type: 'boolean',
                              },
                              hasNextPage: {
                                 type: 'boolean',
                              },
                              prevPage: {
                                 type: 'integer',
                                 nullable: true,
                              },
                              nextPage: {
                                 type: 'integer',
                                 nullable: true,
                              },
                           },
                        },
                     },
                  },
               },
               500: {
                  description: 'Erro ao buscar publicações',
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
                                 example: 'Erro ao buscar publicações',
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      },
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

               const publications = await req.payload.find({
                  collection: 'publications',
                  where: {
                     user: {
                        equals: req.user.id,
                     },
                  },
                  page,
                  limit,
                  depth: 2,
                  sort: '-createdAt',
               });

               const publicationsWithPhotos = await Promise.all(
                  publications.docs.map(async (publication) => {
                     const photos = await req.payload.find({
                        collection: 'photos',
                        where: {
                           publication: {
                              equals: publication.id,
                           },
                        },
                        limit: 100,
                     });

                     let animalPhotos: any[] = [];
                     if (publication.animal && typeof publication.animal === 'object' && publication.animal.id) {
                        const animalPhotosResult = await req.payload.find({
                           collection: 'photos',
                           where: {
                              animal: {
                                 equals: publication.animal.id,
                              },
                           },
                           limit: 100,
                        });
                        animalPhotos = animalPhotosResult.docs;
                     }

                     return {
                        ...publication,
                        photos: photos.docs,
                        animal: publication.animal && typeof publication.animal === 'object'
                           ? {
                              ...publication.animal,
                              photos: animalPhotos,
                           }
                           : publication.animal,
                     };
                  }),
               );

               return Response.json({
                  ...publications,
                  docs: publicationsWithPhotos,
               });
            } catch (error) {
               console.error('Erro ao buscar minhas publicações:', error);
               return Response.json(
                  {
                     success: false,
                     error: 'Erro ao buscar publicações',
                  },
                  { status: 500 },
               );
            }
         },
         openapi: {
            summary: 'Lista publicações do usuário autenticado',
            description:
               'Retorna apenas as publicações criadas pelo usuário logado, ordenadas por data de criação (mais recentes primeiro). Requer autenticação via Bearer token.',
            tags: ['Publications'],
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
                  description: 'Lista de publicações retornada com sucesso',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              docs: {
                                 type: 'array',
                                 description: 'Array de publicações com relacionamentos populados',
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
         if (user.collection === 'users' && user.roles?.includes('admin')) {
            return true;
         }
         return {
            user: {
               equals: user.id,
            },
         };
      },
      delete: ({ req: { user } }) => {
         if (!user) return false;
         if (user.collection === 'users' && user.roles?.includes('admin')) {
            return true;
         }
         return {
            user: {
               equals: user.id,
            },
         };
      },
   },
   admin: {
      useAsTitle: 'title',
   },
   fields: [
      {
         name: 'title',
         type: 'text',
         required: true,
      },
      {
         name: 'description',
         type: 'textarea',
      },
      {
         name: 'type', // 'lost', 'found', 'adoption'
         type: 'select',
         options: [
            { label: 'Perdido', value: 'lost' },
            { label: 'Encontrado', value: 'found' },
            { label: 'Adoção', value: 'adoption' },
         ],
         required: true,
      },
      {
         name: 'status', // 'open', 'closed', 'resolved'
         type: 'select',
         options: [
            { label: 'Aberto', value: 'open' },
            { label: 'Fechado', value: 'closed' },
            { label: 'Resolvido', value: 'resolved' },
         ],
         defaultValue: 'open',
         required: true,
      },
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
         name: 'animal',
         type: 'relationship',
         relationTo: 'animals',
         hasMany: false,
      },
      {
         name: 'location',
         type: 'relationship',
         relationTo: 'locations',
         hasMany: false,
      },
      {
         name: 'disappearance_date',
         type: 'date',
         label: 'Data de Desaparecimento/Encontro',
      },
   ],
   hooks: {
      beforeChange: [logIncomingData, createLocationFromData, addUserToPublication],
      afterChange: [processPhotos],
      afterRead: [addRelationshipIds],
      beforeDelete: [deletePhotos],
   },
};
