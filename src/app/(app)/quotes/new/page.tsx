'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { quoteService } from '@/services/quote-service';
import { QuoteValues } from '@/lib/validations/quote';
import { QuoteForm } from '@/components/features/quotes/quote-form';
import { toast } from 'sonner';

export default function NewQuotePage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: QuoteValues) => quoteService.create(data),
    onSuccess: () => {
      toast.success('Orçamento criado com sucesso!');
      router.push('/quotes');
    },
    onError: (error: any) => {
      const apiError = error.response?.data?.error?.message || error.response?.data?.message || 'Verifique os dados enviados.';
      toast.error(`Erro ao criar orçamento: ${apiError}`);
    },
  });

  const handleSubmit = async (data: QuoteValues) => {
    const { status, ...restData } = data;
    const payload = {
      ...restData,
      items: data.items.map(({ id, ...rest }) => rest)
    };
    mutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Novo Orçamento
      </h1>
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
         <QuoteForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
      </div>
    </div>
  );
}
