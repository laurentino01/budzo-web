import { z } from 'zod';

export const quoteItemSchema = z.object({
  id: z.string().optional(), // For existing items being edited
  description: z.string().min(1, 'Descrição é obrigatória'),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  unitPrice: z.number().min(0, 'Preço unitário não pode ser negativo'),
  unit: z.enum(['sv', 'hour', 'unit', 'day']).default('unit'),
});

export const quoteSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  expiresInValue: z.number().min(1, 'Validade deve ser pelo menos 1'),
  expiresInUnit: z.enum(['days', 'weeks', 'months']).default('days'),
  items: z.array(quoteItemSchema).min(1, 'Adicione pelo menos um item'),
  status: z.enum(['draft', 'pending', 'accepted', 'rejected', 'expired', 'discarded']).optional(),
});

export type QuoteItemValues = z.infer<typeof quoteItemSchema>;
export type QuoteValues = z.infer<typeof quoteSchema>;
