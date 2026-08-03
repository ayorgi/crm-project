'use client';
import React, { useState } from 'react';
import { Bell, CheckCircle2, Circle, Clock, Mail, Info, ShieldCheck, Tag } from 'lucide-react';

const ALL_NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Transfer Confirmed', desc: 'Your trip to Ercan Airport is confirmed. A driver will be assigned soon.', time: '2 mins ago', date: 'Oct 12, 2026', read: false },
  { id: 2, type: 'info', title: 'Driver Assigned', desc: 'Arda Sahin will be your chauffeur. Vehicle: VIP Business Van (Plates: THY 192).', time: '1 hour ago', date: 'Oct 12, 2026', read: false },
  { id: 3, type: 'welcome', title: 'Welcome to VIP Portal', desc: 'Thank you for choosing our luxury services. Enjoy your experience with us.', time: '1 day ago', date: 'Oct 11, 2026', read: true },
  { id: 4, type: 'system', title: 'Profile Updated', desc: 'Your vehicle and cabin preferences were successfully saved.', time: '2 days ago', date: 'Oct 10, 2026', read: true },
  { id: 5, type: 'billing', title: 'Invoice Available', desc: 'The receipt for your last trip (ID: #4092) is ready to download.', time: '3 days ago', date: 'Oct 09, 2026', read: true },
  { id: 6, type: 'promo', title: 'Complimentary Upgrade', desc: 'You have received a complimentary upgrade to First Class Sedan for your next ride.', time: '1 week ago', date: 'Oct 05, 2026', read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'welcome': return <Mail className="w-5 h-5 text-purple-500" />;
      case 'billing': return <Tag className="w-5 h-5 text-amber-500" />;
      case 'system': return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'promo': return <Info className="w-5 h-5 text-rose-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-100';
      case 'welcome': return 'bg-purple-50 border-purple-100';
      case 'billing': return 'bg-amber-50 border-amber-100';
      case 'system': return 'bg-blue-50 border-blue-100';
      case 'promo': return 'bg-rose-50 border-rose-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#aa2d29]" />
            Notifications Center
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Stay updated with your latest trip statuses, invoices, and VIP offers.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 md:p-6 bg-slate-900 flex justify-between items-center text-white">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#aa2d29]" /> Your Inbox
          </span>
          {unreadCount > 0 && (
             <span className="text-xs font-bold text-[#aa2d29] bg-rose-50/10 px-3 py-1 rounded-full border border-[#aa2d29]/30">
               {unreadCount} Unread
             </span>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 md:p-6 flex gap-4 transition-colors ${!notif.read ? 'bg-slate-50/50 hover:bg-slate-50' : 'hover:bg-slate-50/30'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getBgClass(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${!notif.read ? 'text-[#aa2d29]' : 'text-slate-900'}`}>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-[#aa2d29]"></span>}
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{notif.date} • {notif.time}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-1">{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
