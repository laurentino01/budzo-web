import { api } from '@/lib/api';
import { QuoteValues } from '@/lib/validations/quote';

export interface Quote extends QuoteValues {
  id: string;
  number: number;
  createdAt: string;
  total: number;
  companyId: string;
  client?: {
      id: string;
      name: string;
      email?: string;
  };
}

export const quoteService = {
  list: async (params?: { page: number; limit: number; search?: string; status?: string; clientId?: string }) => {
    const response = await api.get('/quotes', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/quotes/${id}`);
    return response.data;
  },

  create: async (data: QuoteValues) => {
    const response = await api.post('/quotes', data);
    console.log(response.data);
    return response.data;
  },

  update: async (id: string, data: Partial<QuoteValues>) => {
    const response = await api.patch(`/quotes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/quotes/${id}`);
    return response.data;
  },

  clone: async (id: string) => {
    const response = await api.post(`/quotes/${id}/clone`);
    return response.data;
  },

  send: async (id: string, method: 'email' | 'link' = 'email') => {
    const response = await api.post(`/quotes/${id}/send`, { method });
    return response.data;
  },

  downloadPdf: async (id: string) => {
    const response = await api.get(`/quotes/${id}/pdf`, {
        responseType: 'blob',
    });
    return response.data;
  }
};
