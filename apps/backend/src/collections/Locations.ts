import type { CollectionConfig } from 'payload';

export const Locations: CollectionConfig = {
    slug: 'locations',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'city',
    },
    endpoints: [
        {
            path: '/districts',
            method: 'get',
            handler: async (req) => {
                try {
                    const locations = await req.payload.find({
                        collection: 'locations',
                        limit: 1000,
                        pagination: false,
                    });

                    const districts = [...new Set(
                        locations.docs
                            .map(loc => loc.district)
                            .filter(district => district && district.trim() !== '')
                    )].sort();

                    return Response.json({
                        success: true,
                        districts,
                    });
                } catch (error) {
                    return Response.json({
                        success: false,
                        error: 'Erro ao buscar bairros',
                    }, { status: 500 });
                }
            },
            openapi: {
                summary: 'Lista bairros únicos',
                description: 'Retorna uma lista de todos os bairros únicos cadastrados no sistema, ordenados alfabeticamente.',
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
    ],
    fields: [
        {
            name: 'street',
            type: 'text',
            required: true,
            label: 'Rua',
        },
        {
            name: 'district',
            type: 'text',
            label: 'Bairro',
        },
        {
            name: 'city',
            type: 'text',
            required: true,
            label: 'Cidade',
        },
        {
            name: 'state',
            type: 'text',
            required: true,
            label: 'Estado',
        },
        {
            name: 'coordinates',
            type: 'point',
            label: 'Coordenadas (Longitude, Latitude)',
        },
    ],
}