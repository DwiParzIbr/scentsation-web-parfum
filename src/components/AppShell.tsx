'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PreFooterGuarantee from '@/components/PreFooterGuarantee';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen bg-slate-100">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <PreFooterGuarantee />
      <Footer />
    </div>
  );
}
