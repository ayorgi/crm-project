'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Clock, MapPin, ArrowRight, PlusCircle, FileText, UserCheck, Ticket } from 'lucide-react';
import { getTimestamp, formatDateBadge } from '@/lib/dateUtils';

export default function PortalDashboard() {
  const [customerName, setCustomerName] = useState('Guest');
  const [upcomingRide, setUpcomingRide] = useState<any | null>(null);

  const loadUpcomingRide = () => {
    const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
    const profile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    const name = localStorage.getItem('currentCustomer') || '';
    if (profile.firstName) {
      setCustomerName(`${profile.firstName} ${profile.lastName}`.trim());
    } else if (name) {
      setCustomerName(name);
    }

    const normalize = (s: string | undefined | null) => (s || '').toLowerCase().trim();

    const userRides = customersDB.filter((c: any) => {
      const cFullName = normalize(`${c.firstName || ''} ${c.lastName || ''}`);
      const cFirstName = normalize(c.firstName);
      const cEmail = normalize(c.email);

      const searchName = normalize(name);
      const profileName = normalize(`${profile.firstName || ''} ${profile.lastName || ''}`);
      const profileFirstName = normalize(profile.firstName);
      const profileEmail = normalize(profile.email);

      if (profileEmail && cEmail === profileEmail) return true;
      if (searchName && (cFullName === searchName || cFirstName === searchName || cEmail === searchName)) return true;
      if (profileName && (cFullName === profileName || cFirstName === profileName)) return true;

      return false;
    });

    const futureRides = userRides.filter((r: any) => {
      if (!r.transferDate) return false;
      return getTimestamp(r.transferDate) >= new Date().setHours(0, 0, 0, 0) && r.status !== 'Cancelled';
    });

    if (futureRides.length > 0) {
      futureRides.sort((a: any, b: any) => getTimestamp(a.transferDate) - getTimestamp(b.transferDate));
      setUpcomingRide(futureRides[0]);
    } else {
      setUpcomingRide(null);
    }
  };

  useEffect(() => {
    loadUpcomingRide();
    window.addEventListener('storage', loadUpcomingRide);
    return () => window.removeEventListener('storage', loadUpcomingRide);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl text-gray-900 font-heading font-black tracking-tight">
            Welcome back, {customerName}
          </h1>
          <p className="text-gray-500 mt-1 text-base font-medium">
            Manage your reservations and upcoming transfers effortlessly.
          </p>
        </div>
        <Link
          href="/portal/book"
          className="inline-flex items-center justify-center gap-2 bg-[#aa2d29] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#8e2622] shadow-md shadow-[#aa2d29]/20 shrink-0 text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Book New Transfer
        </Link>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Next Ride Widget */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Your Next Ride</h2>
          {upcomingRide ? (() => {
            const { day, month } = formatDateBadge(upcomingRide.transferDate);
            return (
              <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-200/70 relative">
                {/* Top Ticket Header Ribbon */}
                <div className="bg-[#aa2d29] text-white px-7 py-3 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <Ticket className="w-4 h-4 text-rose-200" />
                    <span className="font-bold tracking-wide">{upcomingRide.status || 'Confirmed'} Reservation Pass</span>
                    <span className="text-rose-200/80 text-[11px]">#TR-{upcomingRide.id || '9842'}</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/25">
                    Active Ride
                  </span>
                </div>

                {/* Main Ticket Content */}
                <div className="flex flex-col md:flex-row relative">
                  {/* Left Ticket Body */}
                  <div className="flex-1 p-7 md:p-8 space-y-6">
                    {/* Origin & Destination Route */}
                    <div className="flex items-start justify-between gap-4">
                      {/* Pick-up */}
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#aa2d29]" /> Pick-up Location
                        </p>
                        <p className="font-bold text-gray-900 text-base leading-snug">{upcomingRide.pickupLocation || 'Not specified'}</p>
                      </div>

                      {/* Route Line */}
                      <div className="flex flex-col items-center px-2 shrink-0 pt-1.5">
                        <div className="flex items-center gap-1.5 w-24 md:w-32">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#aa2d29] border-2 border-white shadow-xs shrink-0" />
                          <div className="flex-1 h-[2px] bg-gradient-to-r from-[#aa2d29] to-gray-300" />
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-400 border-2 border-white shadow-xs shrink-0" />
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 mt-1.5">{upcomingRide.transferType || 'VIP Transfer'}</span>
                      </div>

                      {/* Drop-off */}
                      <div className="flex-1 text-right">
                        <p className="text-xs font-semibold text-gray-400 mb-1 flex items-center justify-end gap-1.5">
                          Drop-off Location <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        </p>
                        <p className="font-bold text-gray-900 text-base leading-snug">{upcomingRide.dropoffLocation || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Ticket Details Bar */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100/90 text-xs">
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400">Vehicle Assigned</p>
                        <p className="font-bold text-gray-900 mt-0.5 text-sm truncate">{upcomingRide.vehicleType || 'Executive Van'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-gray-400">Passengers</p>
                        <p className="font-bold text-gray-900 mt-0.5 text-sm">
                          {upcomingRide.passengers ? (String(upcomingRide.passengers).replace(/[^0-9]/g, '') || '1') : '1'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Ticket Stub */}
                  <div className="w-full md:w-52 bg-gray-50/80 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between items-center text-center shrink-0">
                    <div>
                      <p className="text-xs font-bold text-[#aa2d29] tracking-wider uppercase mb-1">{month}</p>
                      <p className="text-5xl font-black font-heading text-gray-900 leading-none">{day}</p>
                      <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/80 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-[#aa2d29]" />
                        <span>{upcomingRide.transferTime || 'TBD'}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-gray-200/60 w-full text-center">
                      <span className="text-[11px] font-semibold text-gray-400">Ref: TR-{upcomingRide.id || '9842'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="bg-white rounded-3xl shadow-soft p-10 flex flex-col items-center justify-center text-center border border-gray-100/80">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                <Car className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming rides</h3>
              <p className="text-gray-500 text-sm max-w-sm mb-6">You don't have any upcoming reservations. Book your next premium transfer now.</p>
              <Link
                href="/portal/book"
                className="bg-[#aa2d29] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#8e2622] shadow-md text-sm"
              >
                Book a Transfer
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Quick Actions</h2>
          <div className="space-y-3.5">
            
            {/* 1. My VIP Profile */}
            <Link href="/portal/profile" className="bg-white p-5 rounded-3xl shadow-soft flex items-center justify-between border border-gray-100/80 hover:border-gray-300">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100/60">
                  <UserCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">My VIP Profile</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Manage contact & preferences</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300" />
            </Link>

            {/* 2. View History */}
            <Link href="/portal/trips" className="bg-white p-5 rounded-3xl shadow-soft flex items-center justify-between border border-gray-100/80 hover:border-gray-300">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200/60">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">View History</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Past and cancelled rides</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300" />
            </Link>

            {/* 3. Receipts & Invoices */}
            <Link href="/portal/receipts" className="bg-white p-5 rounded-3xl shadow-soft flex items-center justify-between border border-gray-100/80 hover:border-gray-300">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/60">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Receipts & Invoices</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Download trip receipts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300" />
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
