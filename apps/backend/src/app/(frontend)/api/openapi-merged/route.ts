import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/openapi.json`);
      const baseSpec = await response.json();

      const customPaths = {
         '/api/locations/districts': {
            get: {
               summary: 'Lista bairros únicos',
               description:
                  'Retorna uma lista de todos os bairros únicos cadastrados no sistema, ordenados alfabeticamente.',
               tags: ['Locations'],
               responses: {
                  200: {
                     description: 'Lista de bairros retornada com sucesso',
                     content: {
                        'application/json': {
                           schema: {
                              type: 'object',
                              properties: {
                                 success: {
                                    type: 'boolean',
                                    example: true,
                                 },
                                 districts: {
                                    type: 'array',
                                    items: {
                                       type: 'string',
                                    },
                                    example: ['Centro', 'Jardins', 'Vila Mariana'],
                                 },
                              },
                           },
                        },
                     },
                  },
                  500: {
                     description: 'Erro ao buscar bairros',
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
                                    example: 'Erro ao buscar bairros',
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
         '/api/publications/search': {
            get: {
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
                                       description: 'Objeto da publicação com relacionamentos populados',
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
      };

      const mergedSpec = {
         ...baseSpec,
         paths: {
            ...baseSpec.paths,
            ...customPaths,
         },
      };

      return NextResponse.json(mergedSpec);
   } catch (error) {
      console.error('Erro ao mesclar OpenAPI specs:', error);
      return NextResponse.json(
         { error: 'Erro ao gerar especificação OpenAPI' },
         { status: 500 }
      );
   }
}
