import type { GenderValue, SizeValue, SpeciesValue } from '@encontra-pet/utils';

import { z } from 'zod';

export const AnimalsSchema = z.object({
   name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
   species: z.custom<SpeciesValue>(),
   size: z.custom<SizeValue>(),
   color: z.string(),
   has_collar: z.boolean(),
   gender: z.custom<GenderValue>(),
   notes: z.string(),
   photos: z
      .array(z.instanceof(File, { message: 'Arquivo inválido' }))
      .max(3, 'Você pode selecionar no máximo 3 fotos'),
});

export type AnimalsType = z.infer<typeof AnimalsSchema>;
