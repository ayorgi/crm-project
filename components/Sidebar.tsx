'use client';
import { Plus, LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logoImg from '../public/logo.png';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-white text-gray-900 font-medium text-sm h-full w-64 flex-shrink-0 border-r border-gray-200 flex flex-col p-6 gap-2 z-40 shadow-sm">
      {/* Logo */}
      <div className="mb-8 flex justify-center px-4">
        <Image
          alt="Logo"
          src={logoImg}
          className="w-full max-w-[140px] h-auto object-contain"
        />
      </div>


      {/* New Entry Button */}
      <button className="bg-[#aa2d29] text-white w-full py-2.5 px-4 rounded-lg font-semibold hover:bg-[#8e2622] transition-colors mb-6 flex items-center justify-center gap-2 shadow-sm">
        <Plus className="w-5 h-5" />
        New Entry
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 mt-2">
        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname === '/dashboard' ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        {/* Customers Link */}
        <Link
          href="/dashboard/customers"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/customers') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
          <Users className="w-5 h-5" />
          Customers
        </Link>

      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-gray-200 pt-6 flex flex-col gap-1">
        <Link href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <Link href="/login" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
