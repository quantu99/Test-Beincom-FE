'use client';

import { AuthGuard } from '@/components';
import { Home } from '@/modules';
import { useAuthStore } from '@/store/zustand/authStore';

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <AuthGuard requireAuth={true}>
      <Home />
    </AuthGuard>
  );
}