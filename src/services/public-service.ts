import { api } from '@/lib/api';

export const publicService = {
  getQuoteByToken: async (token: string) => {
    const response = await api.get(`/public/quotes/${token}`);
    return response.data;
  },
  approveQuote: async (token: string) => {
    const response = await api.post(`/public/quotes/${token}/approve`);
    return response.data;
  },
  rejectQuote: async (token: string) => {
    const response = await api.post(`/public/quotes/${token}/reject`);
    return response.data;
  }
};
