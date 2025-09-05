'use client';

import { AuthGuard } from '@/components';
import { useAuthStore } from '@/store/zustand/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AuthGuard requireAuth={true}>
      <div>
        <h1>User Profile</h1>

        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong> {user.email}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Username:</strong> {user.name}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>Account Actions</h2>
          <div style={{ marginTop: '1rem' }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '1rem',
                cursor: 'pointer',
              }}
              onClick={() =>
                alert('Edit profile functionality would be implemented here')
              }
            >
              Edit Profile
            </button>

            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() =>
                alert('Change password functionality would be implemented here')
              }
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
