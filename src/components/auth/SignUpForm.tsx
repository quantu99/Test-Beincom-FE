'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/zustand/authStore';
import { CSEyeOpen, CSEyeClose } from '../common/iconography';
import { Button } from '../common';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            <div className={`relative flex h-10 cursor-text items-center justify-between rounded-md border bg-white px-3 py-2 text-base focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active w-full focus:border-purple-50 focus:shadow-active focus-visible:border-purple-50 focus-visible:shadow-active ${errors.email ? 'border-red-50' : 'border-gray-30'}`}>
              <input
                className="block w-full h-full text-base font-normal text-neutral-60 caret-neutral-60 placeholder:text-base placeholder:font-normal placeholder:text-neutral-20 autofill:!bg-gray-5 autofill:!text-neutral-60 read-only:cursor-default read-only:bg-gray-5 focus-visible:outline-none disabled:bg-gray-5 disabled:font-normal disabled:text-neutral-20"
                id="email"
                type="email"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <span className="text-red-50 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label
              className="text-sm font-medium peer-disabled:cursor-not-allowed text-neutral-40"
              htmlFor="name"
            >
              Full Name:
            </label>
            <div className={`relative flex h-10 cursor-text items-center justify-between rounded-md border bg-white px-3 py-2 text-base focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active w-full focus:border-purple-50 focus:shadow-active focus-visible:border-purple-50 focus-visible:shadow-active ${errors.name ? 'border-red-50' : 'border-gray-30'}`}>
              <input
                className="block w-full h-full text-base font-normal text-neutral-60 caret-neutral-60 placeholder:text-base placeholder:font-normal placeholder:text-neutral-20 autofill:!bg-gray-5 autofill:!text-neutral-60 read-only:cursor-default read-only:bg-gray-5 focus-visible:outline-none disabled:bg-gray-5 disabled:font-normal disabled:text-neutral-20"
                id="name"
                type="text"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <span className="text-red-50 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              className="text-sm font-medium peer-disabled:cursor-not-allowed text-neutral-40"
              htmlFor="password"
            >
              Password:
            </label>
            <div className={`relative flex h-10 cursor-text items-center justify-between rounded-md border bg-white px-3 py-2 text-base focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active w-full focus:border-purple-50 focus:shadow-active focus-visible:border-purple-50 focus-visible:shadow-active ${errors.password ? 'border-red-50' : 'border-gray-30'}`}>
              <input
                className="block w-full h-full text-base font-normal text-neutral-60 caret-neutral-60 placeholder:text-base placeholder:font-normal placeholder:text-neutral-20 autofill:!bg-gray-5 autofill:!text-neutral-60 read-only:cursor-default read-only:bg-gray-5 focus-visible:outline-none disabled:bg-gray-5 disabled:font-normal disabled:text-neutral-20"
                id="password"
                type={showPassword ? 'text' : 'password'}
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
            {errors.password && (
              <span className="text-red-50 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              className="text-sm font-medium peer-disabled:cursor-not-allowed text-neutral-40"
              htmlFor="confirmPassword"
            >
              Confirm Password:
            </label>
            <div className={`relative flex h-10 cursor-text items-center justify-between rounded-md border bg-white px-3 py-2 text-base focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active w-full focus:border-purple-50 focus:shadow-active focus-visible:border-purple-50 focus-visible:shadow-active ${errors.confirmPassword ? 'border-red-50' : 'border-gray-30'}`}>
              <input
                className="block w-full h-full text-base font-normal text-neutral-60 caret-neutral-60 placeholder:text-base placeholder:font-normal placeholder:text-neutral-20 autofill:!bg-gray-5 autofill:!text-neutral-60 read-only:cursor-default read-only:bg-gray-5 focus-visible:outline-none disabled:bg-gray-5 disabled:font-normal disabled:text-neutral-20"
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center [&>svg>path]:fill-neutral-40"
              >
                {showConfirmPassword ? <CSEyeClose /> : <CSEyeOpen />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-50 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            {success}
          </div>
        )}

        <Button
          className="w-full rounded-md bg-customPurple-1 hover:bg-customPurple-2 transition-colors color-white mt-4"
          type="submit"
          disabled={isLoading}
        >
          <span className="text-white text-base font-medium">
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </span>
        </Button>
      </form>

      <div className='flex flex-col text-sm items-center pb-6'>
        <p>Already have an account?</p>
        <button className='hover:underline text-customPurple-4' onClick={() => router.push('/login')}>
          Login here
        </button>
      </div>
    </div>
  );
}