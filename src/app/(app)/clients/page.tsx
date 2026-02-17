'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/client-service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import Link from 'next/link';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => clientService.list({ page, limit: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: () => {
      toast.success('Cliente excluído com sucesso');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => {
      toast.error('Erro ao excluir cliente');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Clientes
        </h1>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center">
                     <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((client: any) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                         <Link href={`/clients/${client.id}`}>Editar</Link>
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(client.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls Placeholder */}
    </div>
  );
}
