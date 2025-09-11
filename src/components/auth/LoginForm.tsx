'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/zustand/authStore';
import { Button, Input } from '../common';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string>('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex w-full flex-col px-6 xs:px-12 flex-1 space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email:"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            type="password"
            label="Password:"
            showPasswordToggle
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <Button
          className="w-full rounded-md bg-customPurple-1 hover:bg-customPurple-2 transition-colors color-white mt-4"
          type="submit"
          disabled={isLoading}
        >
          <span className="text-white text-base font-medium">
            {isLoading ? 'Logging in...' : 'Login'}
          </span>
        </Button>
      </form>

      <div className='flex flex-col text-sm items-center pb-6'>
        <p>Don&apos;t have an account?</p>
        <button className='hover:underline text-customPurple-4' onClick={() => router.push('/signup')}>Sign up here</button>
      </div>
    </div>
  );
}