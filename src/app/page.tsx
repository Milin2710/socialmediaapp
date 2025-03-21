// app/page.tsx
import { getAuthStatus } from '@/lib/auth';
import AuthenticatedHome from '@/components/home/AuthenticatedHome';
import GuestHome from '@/components/home/GuestHome';

export default async function Home() {
  const { isAuthenticated, user } = await getAuthStatus();
  
  return isAuthenticated ? <AuthenticatedHome user={user} /> : <GuestHome />;
}
