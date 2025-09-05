'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/zustand/authStore';
import { Img } from '../common';
import { MENU_ARR, VARIABLE_CONSTANT } from '@/constants';
import { usePathname } from 'next/navigation';
import { CSMagnifest } from '../common/iconography';

export default function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }
  return (
    <header className="h-[3.75rem] fixed top-0 z-header h-navbar w-screen gap-x-6 border-b bg-white px-6 shadow-1 flex items-center justify-center xl:gap-x-12 xl:px-12">
      {/* LEFT */}
      <div className="lg:flex items-center gap-4 hidden">
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
        <div
          role="button"
          className="max-w-[160px]"
        >
          <Img
            src={VARIABLE_CONSTANT.EVENT_BANNER}
            className="w-full h-auto"
            fit="cover"
            alt="event"
          />
        </div>
      </div>
      {/* MENU */}
      <nav className="flex h-full items-end">
        {MENU_ARR.map((menu) => {
          const Icon = menu.icon;
          return (
            <Link
              key={menu.label}
              href={menu.url}
              className="group relative flex h-12 w-20 flex-col justify-between rounded-t-lg hover:bg-neutral-2"
            >
              <span className="h-10 w-full flex items-center justify-center [&>svg>path]:fill-[#6f32bb]">
                <Icon />
              </span>

              <span
                className={`
      absolute bottom-0 left-0 z-10 h-1 w-20 rounded-t-md transition-all
      ${
        pathname === menu.url
          ? 'bg-[#6f32bb]'
          : 'bg-transparent group-hover:bg-[#6f32bb]'
      }
    `}
              />
            </Link>
          );
        })}
      </nav>
      {/* SEARCH */}
      <div className='h-10 lg:w-[270px] min-w-[40px] items-center justify-start gap-x-2 overflow-hidden rounded-lg border border-neutral-5 bg-white pr-2 before:w-1 before:flex-initial before:content-[""] focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active hidden xs:flex'>
        <span className="flex items-center [&>svg>path]:fill-neutral-40">
          <CSMagnifest className='size-5' />
        </span>
        <input className="block w-full bg-transparent text-sm font-normal text-neutral-60 outline-none placeholder:text-sm placeholder:text-neutral-10 placeholder-shown:truncate disabled:cursor-not-allowed disabled:text-neutral-20 peer" />
      </div>
      {/* RIGHT */}
      
    </header>
  );
}
