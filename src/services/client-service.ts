import { api } from '@/lib/api';
import { ClientValues } from '@/lib/validations/client';

export type Client = {
  id: string;
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  document?: string;
  status: 'active' | 'inactive';
};

export const clientService = {
  list: async (params?: { page: number; limit: number; search?: string }) => {
    const response = await api.get('/clients', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (data: ClientValues) => {
    const response = await api.post('/clients', data);
    console.log(response.data);
    return response.data;
  },

  update: async (id: string, data: Partial<ClientValues>) => {
    const response = await api.patch(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};
