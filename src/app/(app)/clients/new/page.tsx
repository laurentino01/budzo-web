'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/client-service';
import { ClientValues } from '@/lib/validations/client';
import { ClientForm } from '@/components/features/clients/client-form';
import { toast } from 'sonner';

export default function NewClientPage() {
  const router = useRouter();


  // Note: Optimistic updates could be done here but simple invalidation is safer for MVP
  const mutation = useMutation({
    mutationFn: (data: ClientValues) => clientService.create(data),
    onSuccess: () => {
      toast.success('Cliente criado com sucesso!');
      router.push('/clients');
    },
    onError: (error: any) => {
      const apiError = error.response?.data?.error?.message || error.response?.data?.message || 'Verifique os dados enviados.';
      toast.error(`Erro ao criar cliente: ${apiError}`);
    },
  });

  const handleSubmit = async (data: ClientValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Novo Cliente
      </h1>
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
         <ClientForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
      </div>
    </div>
  );
}
