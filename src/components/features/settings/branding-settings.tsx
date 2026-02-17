'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const brandingSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida (Use Hex)'),
  logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

type BrandingValues = z.infer<typeof brandingSchema>;

export function BrandingSettings({ initialData }: { initialData?: BrandingValues }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BrandingValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: initialData?.primaryColor || '#3CA9E2',
      logoUrl: initialData?.logoUrl || '',
    },
  });

  async function onSubmit(data: BrandingValues) {
    setIsLoading(true);
    try {
      const response = await api.put('/companies/me/branding', data);
      
      if (response.data.success) {
        toast.success("Branding atualizado!");
        // Might need to refresh a context or trigger a global theme update if implemented
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar branding.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Identidade Visual</CardTitle>
        <CardDescription>
          Personalize a cor principal e o logo que aparecerão nos seus orçamentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
            <div className="flex gap-4 items-end">
                <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Cor Primária (Hex)</FormLabel>
                        <div className="flex gap-2">
                             <div 
                                className="w-10 h-10 rounded border border-slate-200" 
                                style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                                <Input placeholder="#3CA9E2" {...field} />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>URL do Logo</FormLabel>
                    <FormControl>
                        <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-slate-500">
                        * Upload de arquivo será implementado em breve. Por enquanto use uma URL pública.
                    </p>
                </FormItem>
                )}
            />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Branding
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
