'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuthStore } from '@/store/zustand/authStore';

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <AuthGuard requireAuth={true}>
      Hello
    </AuthGuard>
  );
}