'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner'; // We need to install sonner or use a toast component

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCompanyValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      legalName: '',
      tradeName: '',
      document: '',
      contactEmail: user?.email || '',
      contactPhone: '',
    },
  });

  async function onSubmit(data: CreateCompanyValues) {
    setIsLoading(true);
    try {
      const response = await api.post('/companies', data);
      
      if (response.data.success) {
        // Update user store with new companyId if returned, or fetch user again
        // Assuming response.data.data includes the created company info
        // We probably need to refresh the user profile to get the companyId linkage
        
        const userResponse = await api.get('/users/me');
        if (userResponse.data.success) {
            updateUser(userResponse.data.data);
        }

        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      // toast.error("Erro ao criar empresa. Tente novamente.");
      alert("Erro ao criar empresa. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Bem-vindo ao Budzo!</CardTitle>
          <CardDescription>
            Para começar, precisamos de alguns dados da sua empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              
              <FormField
                control={form.control}
                name="tradeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Fantasia (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da Marca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Empresa e Começar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
