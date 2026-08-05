'use client';
import { LayoutDashboard, Users, Settings, LogOut, PieChart, LineChart, Receipt, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logoImg from '../public/logo.png';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-white text-gray-900 font-medium text-sm h-full w-64 flex-shrink-0 flex flex-col p-6 gap-2 z-20 shadow-soft relative">
      {/* Logo */}
      <div className="mb-6 flex justify-center w-full items-center">
        <Link href="/dashboard" className="flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/admin_logo.png"
            alt="TRANSFER VIP"
            className="w-[170px] h-auto object-contain max-h-16"
          />
        </Link>
      </div>


      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 mt-2">
        {/* Dashboard Link */}
        <Link
          href="/dashboard/"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname === '/dashboard' || pathname === '/dashboard/' ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        {/* Bookings Link */}
        <Link
          href="/dashboard/bookings/"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/bookings') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
          <CalendarCheck className="w-5 h-5" />
          Bookings
        </Link>

        {/* VIP Guests Link */}
        <Link
          href="/dashboard/guests/"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/guests') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
          <Users className="w-5 h-5" />
          VIP Guests
        </Link>

        {/* Segments Link */}
        <Link
          href="/dashboard/segments/"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/segments') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
          <PieChart className="w-5 h-5" />
          Segments
        </Link>

        {/* Analytics Link */}
        <Link
          href="/dashboard/analytics/"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/analytics') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
          <LineChart className="w-5 h-5" />
          Analytics
        </Link>

        {/* Invoices Link */}
        <Link
          href="/dashboard/invoices/"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/invoices') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
          <Receipt className="w-5 h-5" />
          Invoices
        </Link>

      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-gray-200 pt-6 flex flex-col gap-1">
        <Link 
          href="/dashboard/settings/" 
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/settings') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>

        <Link href="/login" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold">
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
