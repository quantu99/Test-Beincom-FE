
import { AuthGuard } from '@/components';
import { Home } from '@/modules';

export default function HomePage() {

  return (
    <AuthGuard requireAuth={true}>
      <Home />
    </AuthGuard>
  );
}