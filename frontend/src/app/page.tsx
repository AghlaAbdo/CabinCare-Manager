'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <main className="min-h-screen  flex items-center justify-center">
      <p className="text-black">Redirecting to dashboard...</p>
    </main>
  );
}
