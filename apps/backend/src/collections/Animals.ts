import type { CollectionConfig } from 'payload';

export const Animals: CollectionConfig = {
    slug: 'animals',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'name',
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
            name: 'disappearance_date',
            type: 'date',
            label: 'Data de Desaparecimento/Encontro',
        },
        {
            name: 'notes',
            type: 'textarea',
            label: 'Notas Adicionais',
        },
    ],
}