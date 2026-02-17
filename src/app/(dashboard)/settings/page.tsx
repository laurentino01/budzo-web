'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCompanySchema, CreateCompanyValues } from '@/lib/validations/common';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/use-auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { BrandingSettings } from '@/components/features/settings/branding-settings';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [company, setCompany] = useState<any>(null); // Quick type for now

  // We reuse the createCompanySchema for updates, though usually update schemas are partial
  // For simplicity, we require the same fields or make them optional in a separate schema if needed.
  // Let's assume full update capability here.
  
  const form = useForm<CreateCompanyValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      legalName: '',
      tradeName: '',
      document: '',
      contactEmail: '',
      contactPhone: '',
    },
  });

  useEffect(() => {
    const fetchCompany = async () => {
        try {
            const response = await api.get('/companies/me');
            if (response.data.success) {
                const companyData = response.data.data;
                setCompany(companyData);
                form.reset({
                    legalName: companyData.legalName,
                    tradeName: companyData.tradeName || '',
                    document: companyData.document || '',
                    contactEmail: companyData.contactEmail || '',
                    contactPhone: companyData.contactPhone || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch company settings', error);
            toast.error('Erro ao carregar dados da empresa.');
        } finally {
            setIsFetching(false);
        }
    };

    if (user?.companyId) {
        fetchCompany();
    } else {
        setIsFetching(false);
    }
  }, [user?.companyId, form]);

  async function onSubmit(data: CreateCompanyValues) {
    setIsLoading(true);
    try {
      const response = await api.patch('/companies/me', data);
      
      if (response.data.success) {
        toast.success("Configurações atualizadas com sucesso!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar configurações.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Configurações da Empresa
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
          <CardDescription>
            Atualize as informações legais e de contato da sua empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua Empresa Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="tradeName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome Fantasia</FormLabel>
                        <FormControl>
                        <Input placeholder="Nome da Marca" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                        <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email de Contato</FormLabel>
                        <FormControl>
                        <Input placeholder="contato@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <BrandingSettings initialData={{
        primaryColor: company?.primaryColor || '#3CA9E2',
        logoUrl: company?.logoUrl || '',
      }} />
    </div>
  );
}
