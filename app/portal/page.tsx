'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Clock, MapPin, Calendar, ArrowRight, PlusCircle, FileText } from 'lucide-react';
import { getTimestamp, formatDDMMYYYY } from '@/lib/dateUtils';

export default function PortalDashboard() {
  const [customerName, setCustomerName] = useState('Guest');
  const [upcomingRide, setUpcomingRide] = useState<any | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('currentCustomer') || 'Guest';
    const profile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    setCustomerName(profile.firstName ? `${profile.firstName} ${profile.lastName}`.trim() : name);

    const normalize = (str: string) => (str || '').replace(/\s+/g, ' ').trim().toLowerCase();

    const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
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
    }
  }, []);

  const formatDisplayDate = (d: string) => {
    if (!d) return '';
    if (d.includes('-')) {
      const [y, m, day] = d.split('-');
      if (y && m && day && y.length === 4) return `${day}/${m}/${y}`;
    }
    return d;
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-10">
        <h1 className="text-4xl text-gray-900 font-heading font-bold tracking-tight">Welcome back, {customerName}</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your reservations and upcoming transfers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Next Ride Widget */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Next Ride</h2>
          {upcomingRide ? (
            <div className="bg-white rounded-3xl shadow-soft overflow-hidden group">
              <div className="h-2 bg-[#aa2d29]"></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                      Confirmed
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900">{upcomingRide.transferType || 'Transfer'}</h3>
                    <p className="text-gray-500 mt-1">{upcomingRide.vehicleType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-lg font-bold text-gray-900">{formatDDMMYYYY(upcomingRide.transferDate)}</p>
                    <p className="text-gray-500">{upcomingRide.transferTime}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                      <MapPin className="w-4 h-4 text-[#aa2d29]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pick-up</p>
                      <p className="font-bold text-gray-900">{upcomingRide.pickupLocation || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Drop-off</p>
                      <p className="font-bold text-gray-900">{upcomingRide.dropoffLocation || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-soft p-10 flex flex-col items-center justify-center text-center h-64 border border-transparent">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Car className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming rides</h3>
              <p className="text-gray-500 max-w-sm mb-6">You don't have any upcoming reservations. Book your next premium transfer now.</p>
              <Link
                href="/portal/book"
                className="bg-[#aa2d29] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#8e2622] transition-colors shadow-md"
              >
                Book a Transfer
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="space-y-4">
            
            {/* 1. Book New Transfer */}
            <Link href="/portal/book" className="bg-white p-6 rounded-3xl shadow-soft flex items-center justify-between group hover:border-gray-300 border border-transparent transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-6 h-6 text-[#aa2d29]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Book New Transfer</h3>
                  <p className="text-xs text-gray-500 mt-1">Schedule your next VIP ride</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors group-hover:translate-x-1" />
            </Link>

            {/* 2. View History */}
            <Link href="/portal/trips" className="bg-white p-6 rounded-3xl shadow-soft flex items-center justify-between group hover:border-gray-300 border border-transparent transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">View History</h3>
                  <p className="text-xs text-gray-500 mt-1">Past and cancelled rides</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors group-hover:translate-x-1" />
            </Link>

            {/* 3. Receipts & Invoices */}
            <Link href="/portal/receipts" className="bg-white p-6 rounded-3xl shadow-soft flex items-center justify-between group hover:border-gray-300 border border-transparent transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Receipts & Invoices</h3>
                  <p className="text-xs text-gray-500 mt-1">Download official trip receipts</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors group-hover:translate-x-1" />
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
