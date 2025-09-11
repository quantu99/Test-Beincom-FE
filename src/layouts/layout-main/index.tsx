import { Header } from '@/components';
import { MainBody } from './components';

export async function MainLayout({ children }: any) {
  return (
    <div className="relative">
      <Header />
      <MainBody>
        <div className={``}>{children}</div>
      </MainBody>
    </div>
  );
}
