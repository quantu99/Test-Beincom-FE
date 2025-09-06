'use client';
import { Communities, MainSection, RightNav } from './components';

export function Home() {
  return (
    <div className="w-full max-w-[1920px] mx-auto xl:px-11 flex items-start justify-center gap-x-6 px-5 xl:gap-x-12 pt-0">
      <Communities />
      <MainSection />
      <RightNav />
    </div>
  );
}
