'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientValues } from '@/lib/validations/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

interface ClientFormProps {
  defaultValues?: Partial<ClientValues>;
  onSubmit: (data: ClientValues) => Promise<void>;
  isLoading: boolean;
  isEditing?: boolean;
}

export function ClientForm({ defaultValues, onSubmit, isLoading, isEditing }: ClientFormProps) {
  const form = useForm<ClientValues>({
    resolver: zodResolver(clientSchema) as any,
    defaultValues: defaultValues || {
      name: '',
      email: '',
      phone: '',
      document: '',
      legalName: '',
      address: {
          zipCode: '',
          street: '',
          number: '',
          city: '',
          state: '',
      }
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                    <Input placeholder="Nome do Cliente" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="legalName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Razão Social</FormLabel>
                <FormControl>
                    <Input placeholder="Empresa S.A." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="cliente@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
                <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        
        {/* Address Fields could be grouped */}
        <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium text-sm">Endereço</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                            <Input placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
             </div>
             <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                        <FormLabel>Logradouro</FormLabel>
                        <FormControl>
                            <Input placeholder="Rua..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                      <FormField
                    control={form.control}
                    name="address.number"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                            <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
             </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                            <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                      <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                            <Input placeholder="UF" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
             </div>
        </div>

        <div className="flex justify-end gap-4">
             <Button variant="outline" type="button" onClick={() => window.history.back()}>
                Cancelar
             </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Salvar Alterações' : 'Criar Cliente'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
