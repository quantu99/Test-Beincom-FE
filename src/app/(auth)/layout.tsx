import { Img } from '@/components/common';
import { VARIABLE_CONSTANT } from '@/constants';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="max-w-full p-8 flex items-center justify-center">
      <div className="fixed -z-10 inset-0">
        <Img
          src={VARIABLE_CONSTANT.BACKGROUND}
          alt="background"
          className="w-full h-full"
          fit="fill"
        />
      </div>
      {children}
    </div>
  );
}
