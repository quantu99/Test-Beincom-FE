'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/zustand/authStore';
import { Button, Img } from '../common';
import { MENU_ARR, VARIABLE_CONSTANT } from '@/constants';
import { usePathname } from 'next/navigation';
import {
  CSBell,
  CSChatBubble,
  CSMagnifest,
  CSWallet,
} from '../common/iconography';

const MENU_RIGHT = [
  {
    value: 'noti',
    label: 'Notifications',
    icon: CSBell,
  },
  {
    value: 'chat',
    label: 'Go to BIC Chat',
    icon: CSChatBubble,
  },
  {
    value: 'profile',
    label: 'Your Profile',
    icon: null,
  },
];
export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }
  return (
    <header className="h-[3.75rem] fixed top-0 z-[99] h-navbar w-screen gap-x-6 border-b bg-white px-6 shadow-1 flex items-center justify-center xl:gap-x-12 xl:px-12">
      {/* LEFT */}
      <div className="lg:flex min-w-custom-1 max-w-custom-1 items-center gap-4 hidden">
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
          <div className="lg:w-[110px]">
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
          className="lg:w-[160px]"
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
              <span
                className={`h-10 w-full flex items-center justify-center ${
                  pathname === menu.url
                    ? '[&>svg>path]:fill-[#6f32bb]'
                    : '[&>svg>path]:fill-neutral-40'
                } `}
              >
                <Icon />
              </span>

              <span
                className={`absolute bottom-0 left-0 z-10 h-1 w-20 rounded-t-md transition-all ${
                  pathname === menu.url
                    ? 'bg-[#6f32bb]'
                    : 'bg-transparent group-hover:bg-[#6f32bb]'
                }`}
              />
            </Link>
          );
        })}
      </nav>
      {/* SEARCH */}
      <div className="flex h-fit w-full max-w-[400px]">
        <div className='h-10 lg:w-[270px  min-w-full items-center justify-start gap-x-2 overflow-hidden rounded-lg border border-neutral-5 bg-white pr-2 before:w-1 before:flex-initial before:content-[""] focus-within:border-purple-50 focus-within:shadow-active hover:shadow-hover focus-within:hover:shadow-active hidden xs:flex'>
          <span className="flex items-center [&>svg>path]:fill-neutral-40">
            <CSMagnifest className="size-5" />
          </span>
          <input className="block w-full bg-transparent text-sm font-normal text-neutral-60 outline-none placeholder:text-sm placeholder:text-neutral-10 placeholder-shown:truncate disabled:cursor-not-allowed disabled:text-neutral-20 peer" />
        </div>
      </div>
      {/* RIGHT */}
      <nav className="flex size-full min-w-[288px] max-w-[320px] flex-1 items-center justify-end gap-x-3">
        {MENU_RIGHT.map((mr) => {
          const Icon = mr.icon;
          return (
            <div
              role="button"
              className="relative h-8 w-8 flex rounded-full bg-neutral-2 justify-center items-center hover:bg-neutral-5"
              key={mr.value}
            >
              {Icon ? (
                <div className=" [&>svg>path]:fill-neutral-40">
                  <Icon className="size-6" />
                </div>
              ) : (
                <div className="w-full h-full">
                  <Img
                    src={user?.avatar || VARIABLE_CONSTANT.NO_AVATAR}
                    className="w-full h-full rounded-full"
                    fit="cover"
                  />
                </div>
              )}
            </div>
          );
        })}
        <div className="w-px h-6 mx-2 shrink-0 bg-customGray-1" />
        <div className="relative">
          <Button
            type="button"
            className="flex items-center justify-center space-x-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:!cursor-not-allowed disabled:!ring-0 disabled:focus-visible:!outline-0 focus-visible:outline-neutral-20 active:ring-neutral-20 h-8 px-3 py-2 text-sm focus-visible:outline-2 active:ring-2 [&>svg]:size-5 disabled:bg-gray-5 disabled:text-gray-40 bg-neutral-2 text-neutral-60 hover:bg-neutral-5 relative gap-2 overflow-hidden"
          >
            <div className="flex items-center gap-2 duration-300 group-hover:-translate-y-9">
              <div className="min-w-6 min-h-6 aspect-square [&>svg>path]:fill-neutral-40">
                <CSWallet />
              </div>
              <span className="whitespace-nowrap text-neutral-40">Wallet</span>
            </div>
          </Button>
        </div>
      </nav>
    </header>
  );
}
