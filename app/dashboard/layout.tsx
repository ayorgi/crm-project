'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import TopNav from '../../components/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sanctum_token');
    const user = localStorage.getItem('currentUser');
    const role = localStorage.getItem('userRole');

    // If unauthenticated or non-admin, redirect to login
    if ((!token && !user) || (role && role !== 'admin')) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#aa2d29] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-8" style={{ scrollbarGutter: 'stable' }}>
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

