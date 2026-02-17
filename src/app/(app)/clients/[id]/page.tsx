'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/client-service';
import { ClientValues } from '@/lib/validations/client';
import { ClientForm } from '@/components/features/clients/client-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const { data: client, isLoading: isFetching } = useQuery({
    queryKey: ['client', resolvedParams?.id],
    queryFn: () => clientService.get(resolvedParams!.id),
    enabled: !!resolvedParams?.id,
  });

  const mutation = useMutation({
    mutationFn: (data: ClientValues) => clientService.update(resolvedParams!.id, data),
    onSuccess: () => {
      toast.success('Cliente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', resolvedParams?.id] });
      router.push('/clients');
    },
    onError: () => {
      toast.error('Erro ao atualizar cliente.');
    },
  });

  const handleSubmit = async (data: ClientValues) => {
    mutation.mutate(data);
  };

  if (!resolvedParams || isFetching) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  // Transform API response to Form Values if necessary (e.g. handle nulls)
  const defaultValues: Partial<ClientValues> = {
      name: client?.data?.name,
      email: client?.data?.email || '',
      phone: client?.data?.phone || '',
      document: client?.data?.document || '',
      legalName: client?.data?.legalName || '',
      address: {
          zipCode: client?.data?.address?.zipCode || '',
          street: client?.data?.address?.street || '',
          number: client?.data?.address?.number || '',
          city: client?.data?.address?.city || '',
          state: client?.data?.address?.state || '',
      }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Editar Cliente
      </h1>
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
         <ClientForm 
            defaultValues={defaultValues} 
            onSubmit={handleSubmit} 
            isLoading={mutation.isPending} 
            isEditing
         />
      </div>
    </div>
  );
}
