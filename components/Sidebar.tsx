'use client';
import { Plus, LayoutDashboard, Users, Handshake, CheckSquare, BarChart2, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-white text-gray-900 font-medium text-sm h-full w-64 flex-shrink-0 border-r border-gray-200 flex flex-col p-6 gap-2 z-40 shadow-sm">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <img
          alt="Logo"
          src="https://neareasttechnology.com/templates/neareasttechnology/imgs/header-logo.svg"
          className="w-42 h-auto"
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

        {/* Deals Link */}
        <Link
          href="/dashboard/deals"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/deals') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <Handshake className="w-5 h-5" />
          Deals
        </Link>
        {/* Tasks Link */}
        <Link
          href="/dashboard/tasks"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/tasks') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <CheckSquare className="w-5 h-5" />
          Tasks
        </Link>

        {/* Reports Link */}
        <Link
          href="/dashboard/reports"
          className={`rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-semibold ${pathname.includes('/dashboard/reports') ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <BarChart2 className="w-5 h-5" />
          Reports
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-gray-200 pt-6 flex flex-col gap-1">
        <Link href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
          <HelpCircle className="w-5 h-5" />
          Help
        </Link>
        <Link href="/" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg flex items-center gap-3 px-4 py-2.5 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
