'use client';
import { Search, Bell, User } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="bg-white w-full h-20 z-30 flex justify-between items-center px-8 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-4 text-gray-900 font-semibold">
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:border-[#aa2d29] focus:ring-1 focus:ring-[#aa2d29] outline-none transition-all shadow-sm"
            placeholder="Search"
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 text-gray-500">
        <button className="hover:text-[#aa2d29] transition-colors cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-gray-50">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-500 ml-2 cursor-pointer hover:opacity-90">
          <User className="w-6 h-6" />
        </div>
      </div>
    </header>
  );
}
