'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/zustand/authStore';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { register: registerUser, isLoading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError('');
      setSuccess('');
      
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      
      setSuccess('Registration successful! Redirecting...');
      
      // Redirect to home page after successful registration
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Sign Up</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.email && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">Full Name:</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.name && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.name.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.password && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.password.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.confirmPassword && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '15px',
            padding: '8px',
            border: '1px solid red',
            borderRadius: '4px',
            backgroundColor: '#ffebee'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            color: 'green', 
            marginBottom: '15px',
            padding: '8px',
            border: '1px solid green',
            borderRadius: '4px',
            backgroundColor: '#e8f5e8'
          }}>
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Already have an account?</p>
        <button
          onClick={() => router.push('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Login here
        </button>
      </div>
    </div>
  );
}