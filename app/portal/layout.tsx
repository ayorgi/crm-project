'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, LogOut, Car, Plus, ArrowLeft } from 'lucide-react';
import logoImg from '../../public/logo.png';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [customerName, setCustomerName] = useState('Guest');

  const updateName = () => {
    const profile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    if (profile.firstName) {
      setCustomerName(`${profile.firstName} ${profile.lastName}`.trim());
    } else {
      const name = localStorage.getItem('currentCustomer');
      if (name) setCustomerName(name);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem('currentCustomer');
    if (!name) {
      router.push('/login');
    } else {
      updateName();
    }

    const handleProfileUpdate = () => {
      updateName();
    };

    window.addEventListener('customerProfileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('customerProfileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('currentCustomer');
    router.push('/login');
  };

  const navLinks = [
    { href: '/portal', label: 'Home' },
    { href: '/portal/book', label: 'Book' },
    { href: '/portal/trips', label: 'Trips' },
    { href: '/portal/receipts', label: 'Receipts' },
    { href: '/portal/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/portal" className="flex items-center">
              <Image
                src={logoImg}
                alt="Transfer CRM"
                className="h-8 w-auto mix-blend-multiply"
                priority
              />
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map(link => {
                const isActive = link.href === '/portal'
                  ? (pathname === '/portal' || pathname === '/portal/')
                  : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all relative ${
                      isActive
                        ? 'bg-rose-50 text-[#aa2d29] border border-rose-200/60 font-extrabold shadow-2xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-6">

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-bold text-gray-900 leading-tight">{customerName}</p>
                <p className="text-gray-500 text-xs">VIP Client</p>
              </div>
              <Link
                href="/dashboard/"
                onClick={() => {
                  if (!localStorage.getItem('currentUser')) {
                    localStorage.setItem('currentUser', 'Admin');
                  }
                }}
                className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-xs font-bold transition-colors ml-4 mr-2"
                title="Switch to Admin Dashboard"
              >
                View as Admin
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 ml-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:py-10">
        {(pathname && pathname.replace(/\/$/, '') !== '/portal') && (
          <div className="mb-6">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
