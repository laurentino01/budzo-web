import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, FileText, BarChart3, ShieldCheck } from 'lucide-react';
import { LoginButton } from '@/components/layout/login-button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-budzo-blue/10 text-budzo-blue mb-8">
          🚀 O jeito mais fácil de fechar negócios
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 max-w-3xl">
          Crie orçamentos profissionais em <span className="text-budzo-blue">minutos</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl">
          O Budzo é a plataforma ideal para freelancers e pequenas empresas gerenciarem clientes, enviarem propostas matadoras e acompanharem aprovações em tempo real.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto bg-budzo-blue hover:bg-budzo-blue/90 text-white" asChild>
             <Link href="/login">Começar Gratuitamente</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="#features">Ver Funcionalidades</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-slate-600">Esqueça planilhas e Word. Profissionalize sua apresentação.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Orçamentos Dinâmicos</h3>
              <p className="text-slate-600">Adicione itens, calcule totais automaticamente e gere links públicos ou PDFs com 1 clique.</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Aprovação Transparente</h3>
              <p className="text-slate-600">Seus clientes podem aprovar ou rejeitar as propostas diretamente pelo link que você enviar.</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Gestão de Clientes</h3>
              <p className="text-slate-600">Mantenha um cadastro centralizado dos seus clientes e tenha o histórico completo de propostas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Mini-Section */}
      <section className="py-20 bg-slate-50 text-center">
         <div className="max-w-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simples e direto</h2>
            <p className="text-slate-600 mb-8">Comece agora sem custos. Escale conforme seu negócio cresce.</p>
            
            <div className="bg-white p-8 rounded-2xl border shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-budzo-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MAIS POPULAR</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Plano Starter</h3>
                <div className="text-4xl font-extrabold text-slate-900 mb-6">Grátis <span className="text-sm text-slate-500 font-normal">/para sempre</span></div>
                
                <ul className="space-y-3 text-slate-600 mb-8 max-w-xs mx-auto text-left">
                  <li className="flex items-center"><CheckCircle2 size={18} className="text-green-500 mr-2" /> Clientes ilimitados</li>
                  <li className="flex items-center"><CheckCircle2 size={18} className="text-green-500 mr-2" /> Até 10 orçamentos/mês</li>
                  <li className="flex items-center"><CheckCircle2 size={18} className="text-green-500 mr-2" /> Personalização de logo</li>
                </ul>

                <Button className="w-full bg-budzo-navy text-white hover:bg-budzo-navy/90" asChild>
                   <Link href="/login">Criar Conta</Link>
                </Button>
            </div>
         </div>
      </section>
      
    </div>
  );
}