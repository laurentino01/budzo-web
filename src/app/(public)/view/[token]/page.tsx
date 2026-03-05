'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicService } from '@/services/public-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuoteStatusBadge } from '@/components/features/quotes/quote-status-badge';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const queryClient = useQueryClient();
  const [resolvedParams, setResolvedParams] = useState<{ token: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['publicQuote', resolvedParams?.token],
    queryFn: () => publicService.getQuoteByToken(resolvedParams!.token),
    enabled: !!resolvedParams?.token,
    retry: false,
  });

  const quote = response?.data;

  const approveMutation = useMutation({
    mutationFn: (token: string) => publicService.approveQuote(token),
    onSuccess: () => {
      toast.success('Orçamento aprovado!');
      queryClient.invalidateQueries({ queryKey: ['publicQuote', resolvedParams?.token] });
    },
    onError: () => toast.error('Erro ao aprovar orçamento.'),
  });

  const rejectMutation = useMutation({
    mutationFn: (token: string) => publicService.rejectQuote(token),
    onSuccess: () => {
      toast.info('Orçamento rejeitado.');
      queryClient.invalidateQueries({ queryKey: ['publicQuote', resolvedParams?.token] });
    },
    onError: () => toast.error('Erro ao rejeitar orçamento.'),
  });

  if (!resolvedParams || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>;
  }

  if (isError || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center p-8">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Orçamento Inacessível</h2>
          <p className="text-slate-600">Este link é inválido, expirou ou o orçamento foi removido.</p>
        </Card>
      </div>
    );
  }

  const isPending = quote.status === 'draft' || quote.status === 'pending';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Actions */}
        {isPending && (
          <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-4 z-10">
            <div>
              <h3 className="font-medium text-slate-900">Ação Necessária</h3>
              <p className="text-sm text-slate-500">Por favor, revise os detalhes e informe sua decisão.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none"
                onClick={() => rejectMutation.mutate(resolvedParams.token)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                Rejeitar
              </Button>
              <Button 
                className="flex-1 sm:flex-none border-green-500"
                onClick={() => approveMutation.mutate(resolvedParams.token)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                {approveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Aprovar Orçamento
              </Button>
            </div>
          </div>
        )}

        <Card className="shadow-lg overflow-hidden border-0 ring-1 ring-slate-200">
          <div className="h-2 bg-budzo-blue w-full"></div>
          <CardHeader className="md:flex-row md:items-start md:justify-between pb-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{quote.company?.name || 'Empresa'}</h1>
                <p className="text-slate-500 text-sm">{quote.company?.email}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{quote.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium text-slate-500">Status:</span>
                  <QuoteStatusBadge status={quote.status} />
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 text-left md:text-right space-y-2">
              <div className="text-slate-500 text-sm">
                <span className="font-semibold block text-slate-700">Para:</span>
                {quote.client?.name}<br />
                {quote.client?.email && <>{quote.client?.email}<br /></>}
              </div>
              <div className="pt-4 space-y-1">
                <p className="text-sm"><span className="font-medium text-slate-700">Data:</span> {formatDate(quote.createdAt)}</p>
                {quote.expiresAt && (
                   <p className="text-sm"><span className="font-medium text-slate-700">Validade:</span> {formatDate(quote.expiresAt)}</p>
                )}
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-8 bg-slate-50/50">
            <div className="rounded-lg border bg-white overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm text-slate-600 bg-slate-100 border-b">
                <div className="col-span-6 md:col-span-8">Descrição</div>
                <div className="col-span-2 hidden md:block text-right">Qtd</div>
                <div className="col-span-3 md:col-span-2 text-right">Valor Unit.</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {quote.items?.map((item: any) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-slate-50 transition-colors">
                    <div className="col-span-6 md:col-span-8 font-medium text-slate-900">{item.description}</div>
                    <div className="col-span-2 hidden md:block text-right text-slate-600">{Number(item.quantity).toFixed(2)}</div>
                    <div className="col-span-6 md:col-span-2 text-right text-slate-700">
                       <span className="md:hidden text-xs text-slate-400 mr-2">{Number(item.quantity).toFixed(2)}x</span>
                       {formatCurrency(Number(item.unitPrice))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 p-6 border-t font-bold text-lg flex justify-between items-center rounded-b-lg">
                <span className="text-slate-700">Total</span>
                <span className="text-budzo-blue text-2xl">{formatCurrency(Number(quote.total))}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-slate-50 border-t justify-center py-6 text-sm text-slate-400 text-center flex-col gap-2">
            <p>Este orçamento é um documento digital enviado pela empresa {quote.company?.name || 'remetente'}.</p>
            <p>Desenvolvido com plataforma Budzo.</p>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
