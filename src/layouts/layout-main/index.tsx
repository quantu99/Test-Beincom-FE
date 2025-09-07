import { Header } from '@/components';
import { MainBody } from './components';

export async function MainLayout({ children }: any) {
  return (
    <div className="relative">
      <Header />
      <MainBody>
        <div className={`mt-[3.75rem] pb-[3.75rem]`}>{children}</div>
      </MainBody>
    </div>
  );
}
