'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuthStore } from '@/store/use-auth-store';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // You could also hydrate the store here if not using persist middleware correctly
    // But since we use persist, it should be ready on mount (mostly).
    // However, persist is async in hydration.
    // Zustand's persist hydrates synchronously if using localStorage usually, 
    // but Next.js hydration mismatch can happen.
    // We'll rely on the store's state after mount.
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
       // Check localStorage directly as fallback to prevent premature redirect?
       // Actually simplest is trust store. If not auth, go login.
       const token = localStorage.getItem('budzo_token');
       if (!token) {
           router.push('/login');
       }
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
      return null; // or skeleton
  }

  // Optional: Loading state while verifying auth
  if (!isAuthenticated && isLoading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-64 min-h-screen transition-all duration-300 ease-in-out">
        <div className="container mx-auto p-4 md:p-8 pt-20 md:pt-8 max-w-7xl">
            {children}
        </div>
      </main>
    </div>
  );
}
