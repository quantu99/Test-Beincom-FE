'use client';

import { Img } from '@/components/common';
import { SLOGAN_CONSTANT, VARIABLE_CONSTANT } from '@/constants';
import { CSCircleCheck } from '@/components/common/iconography';
import { AuthGuard, LoginForm } from '@/components';

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex items-center gap-[124px]">
        <div className="lg:hidden xl:flex flex-col gap-6">
          <div className="max-w-[180px]">
            <Img
              src={VARIABLE_CONSTANT.LOGO}
              alt="logo"
              className="w-full h-auto"
              fit="cover"
            />
          </div>
          <ul className="max-w-[500px] space-y-6 ">
            {SLOGAN_CONSTANT.LOGIN.map((slogan) => (
              <li
                className="flex items-center gap-4"
                key={slogan.id}
              >
                <div className="size-6 [&>svg>path]:fill-white">
                  <CSCircleCheck />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-white text-base">
                    {slogan.title}
                  </h3>
                  <span className="text-sm font-normal text-white">
                    {slogan.subTitle}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl">
          <div className="flex w-full flex-col items-center gap-1 p-6 pt-12 xs:p-12 xs:pb-6">
            <div className="text-center text-lg font-bold text-neutral-80 lg:text-2xl">
              Login to Beincom
            </div>
            <div className="mt-1 text-center text-sm font-normal text-neutral-60">
              Enter your credentials to access your account.
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </AuthGuard>
  );
}
