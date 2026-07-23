'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Clock, MapPin, Calendar, CheckCircle2, AlertCircle, Download, ChevronDown } from 'lucide-react';
import { getTimestamp, formatDateBadge, formatDDMMYYYY } from '@/lib/dateUtils';

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const name = localStorage.getItem('currentCustomer') || '';
    const profile = JSON.parse(localStorage.getItem('customerProfile') || '{}');

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

    // Sort by date descending
    userRides.sort((a: any, b: any) => {
      const parseDateStr = (dStr: string) => {
        if (!dStr) return 0;
        if (dStr.includes('/')) {
          const parts = dStr.split('/');
          if (parts.length === 3) return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
        }
        return new Date(dStr).getTime();
      };
      return parseDateStr(b.transferDate) - parseDateStr(a.transferDate);
    });
    // Check tab query param
    if (window.location.search.includes('tab=Past')) {
      setActiveTab('Past');
    }

    setTrips(userRides);
  }, []);

  const handleDownloadReceipt = (trip: any) => {
    const receiptText = `
==============================================
             VIP TRANSFER RECEIPT
==============================================
Booking ID     : #${trip.id}
Date           : ${trip.transferDate} ${trip.transferTime || ''}
Passenger Name : ${trip.firstName || ''} ${trip.lastName || ''}
Company/Hotel  : ${trip.company || 'N/A'}
Service Type   : ${trip.transferType || 'Transfer'}
Vehicle Type   : ${trip.vehicleType || 'VIP Vehicle'}

ROUTE DETAILS:
Pick-up Location  : ${trip.pickupLocation || 'N/A'}
Drop-off Location : ${trip.dropoffLocation || 'N/A'}
Flight Number     : ${trip.flightNumber || 'N/A'}

STATUS: ${trip.status?.toUpperCase() || 'COMPLETED'}
==============================================
Thank you for choosing our VIP Transfer Service!
==============================================
`;
    const blob = new Blob([receiptText.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_VIP_${trip.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDisplayDate = (d: string) => {
    if (!d) return '';
    if (d.includes('-')) {
        const [y, m, day] = d.split('-');
        if (y && m && day && y.length === 4) return `${day}/${m}/${y}`;
    }
    return d;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'Completed': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'In Transit': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Car className="w-3 h-3" /> In Transit</span>;
      case 'Cancelled': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const now = new Date().setHours(0,0,0,0);
  
  const upcomingTrips = trips.filter(t => getTimestamp(t.transferDate) >= now && t.status !== 'Cancelled');
  const pastTrips = trips.filter(t => getTimestamp(t.transferDate) < now || t.status === 'Cancelled');

  const displayTrips = activeTab === 'Upcoming' ? upcomingTrips : pastTrips;

  return (
    <div className="pb-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl text-gray-900 font-heading font-bold tracking-tight">My Trips</h1>
          <p className="text-gray-500 mt-2 text-lg">View and manage your transfer history.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto self-start">
          <button 
            onClick={() => setActiveTab('Upcoming')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button 
            onClick={() => setActiveTab('Past')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Past ({pastTrips.length})
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {displayTrips.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-soft p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {activeTab.toLowerCase()} trips</h3>
            <p className="text-gray-500 max-w-sm mb-6 text-lg">You don't have any {activeTab.toLowerCase()} transfers in your history.</p>
            {activeTab === 'Upcoming' && (
              <Link href="/portal/book" className="bg-[#aa2d29] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#8e2622] transition-colors shadow-md">
                Book a Transfer
              </Link>
            )}
          </div>
        ) : (
          <>
            {displayTrips.slice(0, visibleCount).map((trip: any) => {
              const { day, month } = formatDateBadge(trip.transferDate);
              return (
                <div key={trip.id} className="bg-white rounded-3xl shadow-soft p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center hover:shadow-md transition-shadow">
                  
                  {/* Date & Time Block */}
                  <div className="w-full md:w-48 shrink-0 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                    <p className="text-[#aa2d29] font-bold text-sm uppercase tracking-widest mb-1">
                      {month}
                    </p>
                    <p className="text-4xl font-heading font-black text-gray-900 leading-none mb-2">
                      {day}
                    </p>
                    <p className="text-gray-500 font-bold">{trip.transferTime || 'TBD'}</p>
                  </div>

                  {/* Details Block */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{trip.transferType || 'Transfer'}</h3>
                        <p className="text-gray-500 mt-0.5">{trip.vehicleType}</p>
                      </div>
                      <div>
                        {getStatusBadge(trip.status)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#aa2d29]" />
                        <span className="font-bold text-gray-900 text-sm">Pick-up: <span className="font-medium text-gray-600">{trip.pickupLocation || 'N/A'}</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-900 text-sm">Drop-off: <span className="font-medium text-gray-600">{trip.dropoffLocation || 'N/A'}</span></span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => handleDownloadReceipt(trip)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors border border-gray-200"
                      >
                        <Download className="w-3.5 h-3.5 text-gray-500" /> Download Receipt
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {displayTrips.length > visibleCount && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl font-bold text-xs shadow-soft transition-all flex items-center gap-2 group"
                >
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  Show More (+{displayTrips.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
