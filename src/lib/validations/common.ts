import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email(),
});

export const createCompanySchema = z.object({
  legalName: z.string().min(2, 'Razão Social é obrigatória'),
  tradeName: z.string().optional(),
  document: z.string().min(14, 'CNPJ inválido').max(18, 'CNPJ inválido'), // Simple length check for now
  contactEmail: z.string().email('Email de contato inválido'),
  contactPhone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }).optional(),
});

export type CreateCompanyValues = z.infer<typeof createCompanySchema>;
