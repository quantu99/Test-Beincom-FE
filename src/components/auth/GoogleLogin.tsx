'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/authStore';
import { CSGoogleIcon } from '../common/iconography';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: any) => void;
          renderButton: (element: Element, options: any) => void;
        };
      };
    };
  }
}

export function GoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  // const { googleLogin } = useAuthStore();
  const router = useRouter();

  const handleGoogleLogin = async (credential: string) => {
    try {
      setIsLoading(true);
      // await googleLogin({ credential });
      router.push('/');
    } catch (error: any) {
      console.error('Google login failed:', error);
      alert(error.response?.data?.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      {/* Manual Google Login Button */}
      <button
        onClick={() => {
          // This is a placeholder for actual Google OAuth implementation
          // In a real app, you would implement Google OAuth flow here
          alert('Google login would be implemented here with actual Google OAuth');
        }}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#db4437',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        <CSGoogleIcon />
      </button>
    </div>
  );
}