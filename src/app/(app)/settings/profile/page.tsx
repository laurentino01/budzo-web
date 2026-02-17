'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/lib/validations/common'; // We need a proper schema that matches
import { z } from 'zod';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/use-auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Define a specific schema for profile update
const profileSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  async function onSubmit(data: ProfileValues) {
    setIsLoading(true);
    try {
      const response = await api.patch('/users/me', data);
      
      if (response.data.success) {
        toast.success("Perfil atualizado!");
        updateUser({ name: data.name });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Meu Perfil
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Gerencie suas informações de conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                 <FormLabel>Email</FormLabel>
                 <Input value={user?.email} disabled className="bg-slate-100 text-slate-500" />
                 <p className="text-xs text-slate-500">O email não pode ser alterado.</p>
              </div>

               <div className="space-y-2">
                 <FormLabel>Plano Atual</FormLabel>
                 <div className="p-2 border rounded bg-slate-50 capitalize">
                    {user?.plan?.replace('_', ' ') || 'Free'}
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
