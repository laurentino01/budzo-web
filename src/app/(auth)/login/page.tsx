'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { LucideLayoutDashboard } from 'lucide-react'; // Using a placeholder icon

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Redirect to the backend Authentication endpoint
    // The backend will handle the OAuth flow and redirect back to /auth/callback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-xl w-fit">
            <LucideLayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Bem-vindo ao Budzo
          </CardTitle>
          <CardDescription>
            Crie e envie orçamentos profissionais em segundos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleGoogleLogin}
          >
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
