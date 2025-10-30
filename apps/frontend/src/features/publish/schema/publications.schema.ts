import type { PublicationStatusValue, PublicationTypeValue } from '@encontra-pet/utils';

import { z } from 'zod';

const PublicationsSchemaInput = z.object({
   title: z.string().min(2, 'Título obrigatório'),
   description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
   type: z.custom<PublicationTypeValue>(),
   status: z.custom<PublicationStatusValue>(),
   animal: z.number(),
   street: z.string(),
   district: z.string(),
   city: z.string(),
   state: z.string(),
   coordinates: z.tuple([z.number(), z.number()]),
});

export const PublicationsSchema = PublicationsSchemaInput.transform((data) => ({
   ...data,
   street: data.street ?? '',
   district: data.district ?? '',
   city: data.city ?? '',
   state: data.state ?? '',
   coordinates: data.coordinates ?? ([0, 0] as [number, number]),
}));

export type PublicationType = z.input<typeof PublicationsSchema>;
