'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema, QuoteValues } from '@/lib/validations/quote';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/client-service';
import { formatCurrency } from '@/lib/utils/format';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface QuoteFormProps {
  defaultValues?: Partial<QuoteValues>;
  onSubmit: (data: QuoteValues) => Promise<void>;
  isLoading: boolean;
  isEditing?: boolean;
}

export function QuoteForm({ defaultValues, onSubmit, isLoading, isEditing }: QuoteFormProps) {
  const [itemsTotal, setItemsTotal] = useState(0);

  const form = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema) as any,
    defaultValues: defaultValues || {
      title: '',
      clientId: '',
      expiresInValue: 7,
      expiresInUnit: 'days',
      items: [{ description: '', quantity: 1, unitPrice: 0, unit: 'unit' }],
      status: 'draft',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Watch items to calculate total
  const items = form.watch('items');

  useEffect(() => {
    const total = items.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return acc + (quantity * price);
    }, 0);
    setItemsTotal(total);
  }, [items]);

  // Fetch clients for selection
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => clientService.list({ page: 1, limit: 100 }), // Fetching first 100 for dropdown
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Título do Orçamento</FormLabel>
                    <FormControl>
                    <Input placeholder="Ex: Desenvolvimento Website" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {clients?.data?.map((client: any) => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="flex gap-4 items-end">
             <FormField
                control={form.control}
                name="expiresInValue"
                render={({ field }) => (
                <FormItem className="w-24">
                    <FormLabel>Validade</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="expiresInUnit"
                render={({ field }) => (
                <FormItem className="w-32">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="days">Dias</SelectItem>
                        <SelectItem value="weeks">Semanas</SelectItem>
                        <SelectItem value="months">Meses</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <Separator />

        {/* Items Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Itens do Orçamento</h3>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0, unit: 'unit' })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Item
                </Button>
            </div>

            {fields.map((field, index) => (
                <Card key={field.id}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-5">
                            <FormField
                                control={form.control}
                                name={`items.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Descrição</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Item ou Serviço" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Qtd.</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <div className="md:col-span-2">
                             <FormField
                                control={form.control}
                                name={`items.${index}.unit`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Unidade</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="unit">Unidade</SelectItem>
                                        <SelectItem value="hour">Hora</SelectItem>
                                        <SelectItem value="day">Dia</SelectItem>
                                        <SelectItem value="sv">Serviço</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name={`items.${index}.unitPrice`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Valor Unit.</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-1 flex justify-end pb-2">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Totals Section */}
        <div className="flex justify-end pt-4 border-t">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg w-full max-w-sm space-y-2">
                 <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(itemsTotal)}</span>
                 </div>
                 <p className="text-xs text-slate-500 text-right">
                    * Valor calculado automaticamente com base nos itens.
                 </p>
            </div>
        </div>

        <div className="flex justify-end gap-4">
             <Button variant="outline" type="button" onClick={() => window.history.back()}>
                Cancelar
             </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Salvar Alterações' : 'Criar Orçamento'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
