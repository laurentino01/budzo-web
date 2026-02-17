'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('accessToken');

    if (token) {
      // 1. Set token in store/localStorage
      // We don't have the user object yet, so we just set the token first
      // or we can fetch the user immediately.
      // Let's assume we need to fetch the user.
      
      const fetchUser = async () => {
        try {
            // Manually set auth header for this request since store update might be async or not picked up yet by interceptor if unrelated
            // But interceptor reads from localStorage, so we must set it first.
            localStorage.setItem('budzo_token', token);
            
            const response = await api.get('/users/me');
           
            if (response.data.success) {
                login(response.data.data, token);
                router.push('/dashboard');
            } else {
                console.error('Failed to fetch user profile');
                router.push('/login?error=profile_fetch_failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            router.push('/login?error=login_failed');
        }
      };

      fetchUser();
    } else {
      // No token found, redirect to login
      router.push('/login?error=no_token');
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Autenticando...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
