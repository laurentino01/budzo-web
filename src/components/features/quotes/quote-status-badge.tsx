import { Badge } from '@/components/ui/badge';

type QuoteStatus = 'draft' | 'pending' | 'accepted' | 'rejected' | 'expired' | 'discarded';

const statusConfig: Record<QuoteStatus, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'bg-slate-500 hover:bg-slate-600' },
  pending: { label: 'Enviado', className: 'bg-yellow-500 hover:bg-yellow-600' },
  accepted: { label: 'Aprovado', className: 'bg-green-500 hover:bg-green-600' },
  rejected: { label: 'Rejeitado', className: 'bg-red-500 hover:bg-red-600' },
  expired: { label: 'Expirado', className: 'bg-orange-500 hover:bg-orange-600' },
  discarded: { label: 'Cancelado', className: 'bg-gray-400 hover:bg-gray-500' },
};

export function QuoteStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as QuoteStatus] || statusConfig.draft;

  return (
    <Badge className={`${config.className} text-white`}>
      {config.label}
    </Badge>
  );
}
