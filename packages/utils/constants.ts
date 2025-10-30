export const SPECIES_OPTIONS = [
   { label: 'Cachorro', value: 'dog' },
   { label: 'Gato', value: 'cat' },
] as const;
export type SpeciesValue = (typeof SPECIES_OPTIONS)[number]['value'];

export const SIZE_OPTIONS = [
   { label: 'Pequeno', value: 'small' },
   { label: 'Médio', value: 'medium' },
   { label: 'Grande', value: 'large' },
] as const;
export type SizeValue = (typeof SIZE_OPTIONS)[number]['value'];

export const GENDER_OPTIONS = [
   { label: 'Macho', value: 'male' },
   { label: 'Fêmea', value: 'female' },
   { label: 'Não sei', value: 'unknown' },
] as const;
export type GenderValue = (typeof GENDER_OPTIONS)[number]['value'];

// Publications collection options (must match backend values)
export const PUBLICATION_TYPE_OPTIONS = [
   { label: 'Perdido', value: 'lost' },
   { label: 'Encontrado', value: 'found' },
   // { label: 'Adoção', value: 'adoption' }, // disponível no backend; wizard inicial limita a lost/found
] as const;
export type PublicationTypeValue = (typeof PUBLICATION_TYPE_OPTIONS)[number]['value'];

export const PUBLICATION_STATUS_OPTIONS = [
   { label: 'Aberto', value: 'open' },
   { label: 'Fechado', value: 'closed' },
   { label: 'Resolvido', value: 'resolved' },
] as const;
export type PublicationStatusValue = (typeof PUBLICATION_STATUS_OPTIONS)[number]['value'];

export const LABEL_BY_VALUE = {
   species: Object.fromEntries(SPECIES_OPTIONS.map((o) => [o.value, o.label])),
   size: Object.fromEntries(SIZE_OPTIONS.map((o) => [o.value, o.label])) as Record<
      SizeValue,
      string
   >,
   gender: Object.fromEntries(GENDER_OPTIONS.map((o) => [o.value, o.label])) as Record<
      GenderValue,
      string
   >,
   pubType: Object.fromEntries(PUBLICATION_TYPE_OPTIONS.map((o) => [o.value, o.label])) as Record<
      PublicationTypeValue,
      string
   >,
   pubStatus: Object.fromEntries(
      PUBLICATION_STATUS_OPTIONS.map((o) => [o.value, o.label]),
   ) as Record<PublicationStatusValue, string>,
};
