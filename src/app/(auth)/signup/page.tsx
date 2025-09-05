'use client';

import { AuthGuard, GoogleLogin, SignupForm } from "@/components";


export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '70vh' 
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Join Beincom
          </h1>
          
          <SignupForm />
          
          <div style={{ 
            margin: '1rem 0', 
            textAlign: 'center', 
            position: 'relative' 
          }}>
            <hr style={{ border: '1px solid #dee2e6' }} />
            <span style={{ 
              position: 'absolute', 
              top: '-10px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              backgroundColor: '#fff', 
              padding: '0 1rem',
              color: '#666'
            }}>
              OR
            </span>
          </div>
          
          <GoogleLogin />
        </div>
      </div>
    </AuthGuard>
  );
}