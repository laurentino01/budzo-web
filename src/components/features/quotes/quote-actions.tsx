'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Send, 
  Download, 
  Copy, 
  Trash2, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { quoteService } from '@/services/quote-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface QuoteActionsProps {
  quoteId: string;
  status: string;
  publicToken?: string;
  onDelete?: () => void;
}

export function QuoteActions({ quoteId, status, publicToken, onDelete }: QuoteActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const handleCopyLink = async () => {
    if (!publicToken) return;
    const url = `${window.location.origin}/view/${publicToken}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar link.');
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await quoteService.send(quoteId, 'email');
      toast.success('Orçamento enviado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    } catch (error) {
      toast.error('Erro ao enviar orçamento.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await quoteService.downloadPdf(quoteId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quote-${quoteId}.pdf`); // Ideally use number
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error('Erro ao baixar PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClone = async () => {
    setIsCloning(true);
    try {
      const newQuote = await quoteService.clone(quoteId);
      toast.success('Orçamento duplicado!');
      router.push(`/quotes/${newQuote.data.id}`);
    } catch (error) {
      toast.error('Erro ao duplicar orçamento.');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload} 
        disabled={isDownloading}
      >
        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
        PDF
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSend} disabled={isSending}>
            <Send className="mr-2 h-4 w-4" />
            {status === 'draft' ? 'Enviar para Cliente' : 'Reenviar Email'}
          </DropdownMenuItem>
          {publicToken && (
            <DropdownMenuItem onClick={handleCopyLink}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Copiar Link Público
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleClone} disabled={isCloning}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </DropdownMenuItem>
          {onDelete && (
             <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
