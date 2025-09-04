'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/zustand/authStore';
import { Img } from '../common';
import { VARIABLE_CONSTANT } from '@/constants';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }
  return (
    <header className="fixed top-0 z-header h-navbar w-screen gap-x-6 border-b bg-white px-6 shadow-1 flex items-center justify-center xl:gap-x-12 xl:px-12">
      <Link
        href="/"
        className="flex items-center gap-1.5"
      >
        <div className="size-7 aspect-square">
          <Img
            src={VARIABLE_CONSTANT.SHORT_LOGO}
            className="w-full h-full"
            fit="cover"
            alt="SHORT_LOGO"
          />
        </div>
        <div className="max-w-[110px]">
          <Img
            src={VARIABLE_CONSTANT.DARK_LOGO}
            className="w-full h-full"
            fit="cover"
            alt="DARK_LOGO"
          />
        </div>
      </Link>
    </header>
  );
}
