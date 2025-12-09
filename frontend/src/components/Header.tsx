'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link href="/dashboard" className="flex w-fit items-center gap-3">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            CabinCare Manager
          </span>
        </Link>
      </div>
    </header>
  );
}
