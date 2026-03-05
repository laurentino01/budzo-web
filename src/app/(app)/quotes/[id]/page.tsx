'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '@/services/quote-service';
import { QuoteValues } from '@/lib/validations/quote';
import { QuoteForm } from '@/components/features/quotes/quote-form';
import { QuoteActions } from '@/components/features/quotes/quote-actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const { data: quote, isLoading: isFetching } = useQuery({
    queryKey: ['quote', resolvedParams?.id],
    queryFn: () => quoteService.get(resolvedParams!.id),
    enabled: !!resolvedParams?.id,
  });

  const mutation = useMutation({
    mutationFn: (data: QuoteValues) => quoteService.update(resolvedParams!.id, data),
    onSuccess: () => {
      toast.success('Orçamento atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', resolvedParams?.id] });
      router.push('/quotes');
    },
    onError: () => {
      toast.error('Erro ao atualizar orçamento.');
    },
  });

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
        try {
            await quoteService.delete(resolvedParams!.id);
            toast.success('Orçamento excluído.');
            router.push('/quotes');
        } catch (error) {
            toast.error('Erro ao excluir.');
        }
    }
  };

  const handleSubmit = async (data: QuoteValues) => {
    mutation.mutate(data);
  };

  if (!resolvedParams || isFetching) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  const defaultValues: Partial<QuoteValues> = {
      title: quote?.data?.title,
      clientId: quote?.data?.clientId,
      expiresInValue: quote?.data?.expiresInValue,
      expiresInUnit: quote?.data?.expiresInUnit,
      items: quote?.data?.items?.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          unit: item.unit,
          id: item.id // Keep ID for updates
      })),
      status: quote?.data?.status,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Editar Orçamento
        </h1>
        {quote?.data && (
            <QuoteActions 
                quoteId={quote.data.id} 
                status={quote.data.status} 
                publicToken={quote.data.publicToken}
                onDelete={handleDelete}
            />
        )}
      </div>
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
         <QuoteForm 
            defaultValues={defaultValues} 
            onSubmit={handleSubmit} 
            isLoading={mutation.isPending} 
            isEditing
         />
      </div>
    </div>
  );
}
