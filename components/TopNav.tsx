'use client';
import React, { useState, useEffect, useRef } from 'react';
import { User, X, LayoutDashboard, Plus, Users, Receipt, LineChart, PieChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NewReservationModal from './NewReservationModal';

export default function TopNav() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState('Arda');
  const [userRole, setUserRole] = useState('Admin');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  const getPageMeta = (path: string | null) => {
    if (!path || path === '/dashboard' || path === '/dashboard/') {
      return {
        title: 'Dashboard',
        description: "Here's what's happening with your VIP guests today.",
        icon: <LayoutDashboard className="w-5 h-5 text-[#aa2d29]" />
      };
    }
    if (path.includes('/customers')) {
      return {
        title: 'VIP Guests',
        description: 'Manage reservations, transfers and guest profiles.',
        icon: <Users className="w-5 h-5 text-[#aa2d29]" />
      };
    }
    if (path.includes('/invoices')) {
      return {
        title: 'Financials & Billing',
        description: 'Manage corporate invoices and individual payments.',
        icon: <Receipt className="w-5 h-5 text-[#aa2d29]" />
      };
    }
    if (path.includes('/analytics')) {
      return {
        title: 'Analytics Center',
        description: 'Comprehensive performance and operational insights.',
        icon: <LineChart className="w-5 h-5 text-[#aa2d29]" />
      };
    }
    if (path.includes('/segments')) {
      return {
        title: 'Passenger Segments',
        description: 'Smart segmentation based on flight frequency and spending.',
        icon: <PieChart className="w-5 h-5 text-[#aa2d29]" />
      };
    }
    if (path.includes('/profile')) {
      return {
        title: 'Profile Settings',
        description: 'Manage your personal information and account preferences.',
        icon: <User className="w-5 h-5 text-[#aa2d29]" />
      };
    }
    if (path.includes('/settings')) {
      return {
        title: 'System Settings',
        description: 'Configure workspace preferences and fleet parameters.',
        icon: <Settings className="w-5 h-5 text-[#aa2d29]" />
      };
    }
    return {
      title: 'Dashboard',
      description: "Here's what's happening with your VIP guests today.",
      icon: <LayoutDashboard className="w-5 h-5 text-[#aa2d29]" />
    };
  };

  const pageMeta = getPageMeta(pathname);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Profile Info
  useEffect(() => {
    const savedName = localStorage.getItem('currentUser');
    if (savedName) setCurrentUser(savedName);

    const savedRole = localStorage.getItem('currentUserRole');
    if (savedRole) setUserRole(savedRole);

    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) setProfilePic(savedPic);
  }, []);

  return (
    <header className="bg-white w-full h-20 z-30 flex justify-between items-center px-8 border-b border-gray-200 flex-shrink-0">
      {/* Left: Active Page Icon + Page Title & Description */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center shadow-2xs shrink-0">
          {pageMeta.icon}
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold text-gray-900 tracking-tight leading-tight">
            {pageMeta.title}
          </h1>
          <p className="text-xs text-gray-500 font-medium hidden sm:block">
            {pageMeta.description}
          </p>
        </div>
      </div>

      {/* Right Side: New Reservation Button + Divider + View as Customer + Profile */}
      <div className="flex items-center gap-4 text-gray-500">
        {/* Flux Style New Reservation Button */}
        <button
          onClick={() => setIsReservationModalOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 bg-[#aa2d29] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#8e2622] active:scale-95 transition-all shadow-md shadow-[#aa2d29]/20 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Reservation</span>
        </button>

        {/* Global New Reservation Popup Modal */}
        <NewReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
        />

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-gray-200 hidden md:block" />

        <button
          onClick={() => {
            if (!localStorage.getItem('currentCustomer')) {
              localStorage.setItem('currentCustomer', 'Admin Tester');
            }
            window.location.href = '/portal';
          }}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-xs font-bold transition-colors"
        >
          View as Customer
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-500 cursor-pointer hover:opacity-90 overflow-hidden"
          >
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>

          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-500 overflow-hidden mb-2">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>
                <h3 className="font-bold text-gray-900">{currentUser}</h3>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <Link href="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Edit Profile
                </Link>
                <Link href="/login" className="px-3 py-2 text-sm text-[#aa2d29] hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2">
                  <X className="w-4 h-4" /> Logout
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
