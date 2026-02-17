import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro_monthly' | 'pro_annual';
  companyId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) => {
        // Side effect: save token to localStorage for API usage
        if (typeof window !== 'undefined') {
          localStorage.setItem('budzo_token', token);
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('budzo_token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updates } : null 
        })),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'budzo-auth-storage', // unique name for localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist these fields
    }
  )
);
