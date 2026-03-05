import { z } from 'zod';

// Helper to transform empty strings to undefined
const emptyStringToUndefined = z.string().optional().transform(v => v === '' ? undefined : v);

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  legalName: emptyStringToUndefined,
  email: z.string().email('Email inválido').optional().or(z.literal('').transform(() => undefined)),
  phone: emptyStringToUndefined,
  document: emptyStringToUndefined,
  address: z.object({
    street: emptyStringToUndefined,
    number: emptyStringToUndefined,
    zipCode: emptyStringToUndefined,
    city: emptyStringToUndefined,
    state: emptyStringToUndefined,
  }).optional(),
});

export type ClientValues = z.infer<typeof clientSchema>;
