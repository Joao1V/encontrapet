import type { CollectionAfterChangeHook, CollectionConfig } from 'payload';

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
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'name',
    },
    hooks: {
        afterChange: [processPhotos],
    },
    fields: [
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
}