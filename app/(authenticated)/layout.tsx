import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}
