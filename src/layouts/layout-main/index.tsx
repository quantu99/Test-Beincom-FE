import { Header } from '@/components';
import { MainBody } from './components';

export async function MainLayout({ children }: any) {
  return (
    <div className="relative">
      <Header />
      <MainBody>
        <div className={`min-h-screen relative mt-[3.75rem]`}>{children}</div>
      </MainBody>
    </div>
  );
}
