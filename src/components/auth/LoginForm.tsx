'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/zustand/authStore';
import Button from '../common/Button';
import { CSEyeOpen, CSEyeClose } from '../common/iconography';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
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
          {/* Email */}
          <div className="space-y-1">
            <label
              className="text-sm font-medium peer-disabled:cursor-not-allowed text-neutral-40"
              htmlFor="email"
            >
              Email:
            </label>
            <div className="relative flex h-10 cursor-text items-center justify-between rounded-md border bg-white px-3 py-2 text-base focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active border-red-50 w-full focus:border-purple-50 focus:shadow-active focus-visible:border-purple-50 focus-visible:shadow-active">
              <input
                className="block w-full h-full text-base font-normal text-neutral-60 caret-neutral-60 placeholder:text-base placeholder:font-normal placeholder:text-neutral-20 autofill:!bg-gray-5 autofill:!text-neutral-60 read-only:cursor-default read-only:bg-gray-5 focus-visible:outline-none disabled:bg-gray-5 disabled:font-normal disabled:text-neutral-20"
                id="email"
                type="email"
                {...register('email')}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              className="text-sm font-medium peer-disabled:cursor-not-allowed text-neutral-40"
              htmlFor="password"
            >
              Password:
            </label>
            <div className="relative flex h-10 cursor-text items-center justify-between rounded-md border bg-white px-3 py-2 text-base focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active border-red-50 w-full focus:border-purple-50 focus:shadow-active focus-visible:border-purple-50 focus-visible:shadow-active">
              <input
                className="block w-full h-full text-base font-normal text-neutral-60 caret-neutral-60 placeholder:text-base placeholder:font-normal placeholder:text-neutral-20 autofill:!bg-gray-5 autofill:!text-neutral-60 read-only:cursor-default read-only:bg-gray-5 focus-visible:outline-none disabled:bg-gray-5 disabled:font-normal disabled:text-neutral-20"
                id="password"
                type={showPassword ? 'text' : 'password'} // 👈 đổi type
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center [&>svg>path]:fill-neutral-40"
              >
                {showPassword ? <CSEyeClose /> : <CSEyeOpen />}
              </button>
            </div>
          </div>
        </div>

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

      <div>
        <p>Don&apos;t have an account?</p>
        <button onClick={() => router.push('/signup')}>Sign up here</button>
      </div>
    </div>
  );
}
