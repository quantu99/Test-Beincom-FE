'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/authStore';

export function LogoutButton() {
  const { logout, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      style={{
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}