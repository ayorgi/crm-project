'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  PlusCircle,
  Car,
  Receipt,
  User,
  LogOut,
  HelpCircle,
  Bell,
  Headphones,
  Plus,
  Menu,
  X,
  Search,
  Settings,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import logoImg from '../../public/logo.png';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [customerName, setCustomerName] = useState('Guest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const DUMMY_NOTIFICATIONS = [
    { id: 1, title: 'Transfer Confirmed', desc: 'Your trip to Ercan Airport is confirmed.', time: '2m ago', read: false },
    { id: 2, title: 'Driver Assigned', desc: 'Arda Sahin will be your chauffeur.', time: '1h ago', read: false },
    { id: 3, title: 'Welcome to VIP Portal', desc: 'Enjoy your luxury experience with us.', time: '1d ago', read: true },
    { id: 4, title: 'Profile Updated', desc: 'Your vehicle preferences were saved.', time: '2d ago', read: true },
    { id: 5, title: 'Invoice Available', desc: 'Receipt for your last trip is ready.', time: '3d ago', read: true },
  ];

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
    // Always scroll to top when switching pages/categories
    window.scrollTo(0, 0);

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
    const keysToRemove = [
      'currentCustomer', 'currentCustomerEmail', 'currentUser', 'currentUserEmail',
      'currentUserRole', 'userRole', 'sanctum_token', 'customersDB', 'customerProfile',
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    router.push('/login');
  };

  const navLinks = [
    { href: '/portal', label: 'Home', icon: LayoutDashboard },
    { href: '/portal/trips', label: 'Trips', icon: Car },
    { href: '/portal/receipts', label: 'Receipts', icon: Receipt },
    { href: '/portal/profile', label: 'Profile', icon: User },
  ];


  return (
    <div className="min-h-screen flex bg-[#f4f5f7] font-sans text-slate-900 selection:bg-[#aa2d29] selection:text-white">
      {/* LEFT SIDEBAR (Dark Slate Style with #aa2d29 Crimson) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1c222d] border-r border-slate-800/80 sticky top-0 h-screen z-40 shrink-0 text-white shadow-xl">
        {/* Top Logo */}
        <div className="px-6 py-6 border-b border-slate-800/60 flex items-center justify-center">
          <Link href="/portal" className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand_logo.png"
              alt="TRANSFER VIP"
              className="w-[170px] h-auto object-contain max-h-16"
            />
          </Link>
        </div>



        {/* Main Navigation Links (Exactly 5 Links) */}
        <div className="flex-1 py-3 space-y-1 overflow-y-auto">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = link.href === '/portal'
              ? (pathname === '/portal' || pathname === '/portal/')
              : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3.5 px-6 py-3.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2d3545] text-white font-bold border-l-4 border-[#aa2d29]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Sidebar Items: Support, Settings & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-1 bg-[#171c26]">
          <Link
            href="/portal/support"
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              pathname?.startsWith('/portal/support')
                ? 'bg-[#2d3545] text-white font-bold border-l-4 border-[#aa2d29]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Support</span>
          </Link>

          <Link
            href="/portal/notifications"
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              pathname?.startsWith('/portal/notifications')
                ? 'bg-[#2d3545] text-white font-bold border-l-4 border-[#aa2d29]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1c222d] border-b border-slate-800 px-4 h-16 flex items-center justify-between shadow-md text-white">
        <Link href="/portal" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand_logo.png"
            alt="TRANSFER VIP"
            className="w-[140px] h-auto object-contain max-h-10"
          />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md pt-16" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-[#1c222d] border-b border-slate-800 p-6 space-y-4 shadow-2xl text-white" onClick={e => e.stopPropagation()}>
            <div className="space-y-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = link.href === '/portal'
                  ? (pathname === '/portal' || pathname === '/portal/')
                  : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                      isActive ? 'bg-[#2d3545] text-white border-l-4 border-[#aa2d29]' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                href="/portal/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  pathname?.startsWith('/portal/notifications')
                    ? 'bg-[#2d3545] text-white border-l-4 border-[#aa2d29]'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-slate-200/80 h-16 lg:h-20 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Right Header Actions */}
          <div className="flex items-center gap-4 ml-auto">

            <div className="relative">
              <button
                onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                onBlur={() => setTimeout(() => setNotificationMenuOpen(false), 200)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#aa2d29] rounded-full ring-2 ring-white"></span>
              </button>

              {notificationMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] font-bold text-[#aa2d29] bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">2 New</span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {DUMMY_NOTIFICATIONS.map(notif => (
                      <div key={notif.id} className={`p-4 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-slate-50/50' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-xs font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-snug">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-2 border-t border-slate-100 bg-slate-50/30">
                    <Link 
                      href="/portal/notifications"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#aa2d29] hover:bg-rose-50 transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

            <div className="relative">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                onBlur={() => setTimeout(() => setProfileMenuOpen(false), 200)}
                className="flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#aa2d29] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-left">
                  <p className="font-bold text-slate-900 text-sm leading-tight">{customerName}</p>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-[#aa2d29]" />
                      <span className="text-xs font-bold text-[#aa2d29] uppercase tracking-widest">VIP Guest</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{customerName}</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <Link href="/portal/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#aa2d29] transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link href="/portal/trips" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#aa2d29] transition-colors">
                      <Car className="w-4 h-4" /> My Transfers
                    </Link>
                    <Link href="/portal/receipts" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#aa2d29] transition-colors">
                      <Receipt className="w-4 h-4" /> Receipts
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t border-slate-100">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
