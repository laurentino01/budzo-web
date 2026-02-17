import { z } from 'zod';

// ... (existing schemas)

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  legalName: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  document: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }).optional(),
});

export type ClientValues = z.infer<typeof clientSchema>;
