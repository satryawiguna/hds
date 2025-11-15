'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
