'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Check, AlertTriangle, Calendar, Info, X } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transfer' | 'risk' | 'system';
  time: string;
  read: boolean;
  link?: string;
}

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [currentUser, setCurrentUser] = useState('Arda');
  const [userRole, setUserRole] = useState('Admin');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
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

  // Generate Notifications dynamically
  useEffect(() => {
    const customers = JSON.parse(localStorage.getItem('customersDB') || '[]');
    const generated: Notification[] = [];
    const now = new Date();
    
    // Dates for checking upcoming
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const tStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const daStr = `${dayAfter.getFullYear()}-${String(dayAfter.getMonth() + 1).padStart(2, '0')}-${String(dayAfter.getDate()).padStart(2, '0')}`;
    const upcomingDays = [todayStr, tStr, daStr];

    customers.forEach((c: any) => {
      // 1. Upcoming Transfers (Today)
      if (c.transferDate && c.transferDate === todayStr && c.status !== 'Completed' && c.status !== 'Cancelled') {
        generated.push({
          id: `transfer-${c.id || Math.random()}`,
          title: 'Transfer Today',
          message: `${c.firstName} ${c.lastName} has a transfer scheduled for ${c.transferTime || 'today'}.`,
          type: 'transfer',
          time: c.transferTime || 'Today',
          read: false,
          link: '/dashboard/customers'
        });
      }

      // 2. Missing Info Warning
      if (c.transferDate && upcomingDays.includes(c.transferDate) && c.status !== 'Completed' && c.status !== 'Cancelled') {
        if (!c.flightNumber || !c.pickupLocation || !c.dropoffLocation) {
          generated.push({
            id: `missing-${c.id || Math.random()}`,
            title: 'Missing Info Warning',
            message: `${c.firstName} ${c.lastName}'s upcoming transfer is missing route or flight details.`,
            type: 'risk',
            time: 'Action Required',
            read: false,
            link: '/dashboard/customers'
          });
        }
      }
    });

    // 3. Analytics Milestone
    if (customers.length >= 10) {
      generated.push({
        id: `milestone-${Math.floor(customers.length / 10) * 10}`,
        title: 'Analytics Milestone',
        message: `Congratulations! You've crossed the ${Math.floor(customers.length / 10) * 10} total transfers milestone.`,
        type: 'system',
        time: 'Recent',
        read: false,
        link: '/dashboard/analytics'
      });
    }

    setNotifications(generated.reverse().slice(0, 5));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'transfer': return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

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
      
      <div className="flex items-center gap-4 text-gray-500">
        
        <button 
          onClick={() => {
            if (!localStorage.getItem('currentCustomer')) {
              localStorage.setItem('currentCustomer', 'Admin Tester');
            }
            window.location.href = '/portal';
          }}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-xs font-bold transition-colors mr-2"
        >
          View as Customer
        </button>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`relative hover:text-[#aa2d29] transition-colors cursor-pointer active:opacity-80 p-2 rounded-full ${isOpen ? 'bg-gray-100 text-[#aa2d29]' : 'hover:bg-gray-50'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white" />
            )}
          </button>

          {isOpen && (
            <div className="absolute top-12 right-0 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm">Notifications {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#aa2d29] text-white text-[10px]">{unreadCount}</span>}</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-[11px] font-semibold text-[#aa2d29] hover:underline flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                    <Bell className="w-8 h-8 opacity-20" />
                    No new notifications
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-gray-50">
                    {notifications.map(n => (
                      <Link href={n.link || '#'} key={n.id} onClick={() => { markAsRead(n.id); setIsOpen(false); }} className={`group/item p-4 flex gap-3 hover:bg-gray-50 transition-colors relative ${!n.read ? 'bg-blue-50/30' : ''}`}>
                        <div className="mt-0.5 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 pr-5">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className={`text-sm font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</h4>
                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotification(n.id); }}
                          className="absolute right-3 top-3.5 p-1 rounded-md opacity-0 group-hover/item:opacity-100 hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
