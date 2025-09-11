'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/zustand/authStore';
import { Button, Input } from '../common';

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

const alertVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 }
};

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
      
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex w-full flex-col px-6 xs:px-12 flex-1 space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email:"
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <Input
          id="name"
          type="text"
          label="Full Name:"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <Input
          id="password"
          type="password"
          label="Password:"
          showPasswordToggle
          error={errors.password?.message}
          required
          {...register('password')}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password:"
          showPasswordToggle
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword')}
        />

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                variants={alertVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                variants={alertVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            className="w-full rounded-md bg-customPurple-1 hover:bg-customPurple-2 transition-colors duration-200 color-white"
            type="submit"
            disabled={isLoading}
          >
            <span className="text-white text-base font-medium">
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </span>
          </Button>
        </motion.div>
      </form>

      <div className='flex flex-col text-sm items-center pb-6 space-y-1'>
        <p>Already have an account?</p>
        <motion.button 
          className='hover:underline text-customPurple-4' 
          onClick={() => router.push('/login')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Login here
        </motion.button>
      </div>
    </div>
  );
}