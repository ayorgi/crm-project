'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Car, Clock, CheckCircle2, AlertCircle, Download, ChevronDown, 
  Calendar, MapPin, Plane, Users, Search, X, AlertTriangle
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatDateBadge, getTimestamp } from '@/lib/dateUtils';
import { downloadInvoiceHtml, parseReservationPricing } from '@/lib/invoiceTemplate';

function parseNotes(notes: string = '') {
  if (!notes) return { summary: '', specialRequests: '' };

  const quietMatch = notes.match(/\[Quiet Ride:\s*([^\]]+)\]/i);
  const climateMatch = notes.match(/\[Climate:\s*([^\]]+)\]/i);
  const childSeatMatch = notes.match(/\[Child Seat:\s*([^\]]+)\]/i);
  const meetSignMatch = notes.match(/\[Meet Sign:\s*([^\]]+)\]/i);

  const cleanNotes = notes
    .replace(/\[[^\]]+\]/g, '')
    .replace(/^Notes:\s*/i, '')
    .trim();

  const tags: string[] = [];
  if (quietMatch && quietMatch[1].trim() !== 'Standard') tags.push(quietMatch[1].trim());
  if (climateMatch && climateMatch[1].trim() !== 'Optimal') tags.push(`Climate: ${climateMatch[1].trim()}`);
  if (childSeatMatch && childSeatMatch[1].trim().toLowerCase() !== 'none') tags.push(`Child seat: ${childSeatMatch[1].trim()}`);
  if (meetSignMatch) tags.push(`Sign: "${meetSignMatch[1].trim()}"`);

  return {
    summary: tags.join(' • '),
    specialRequests: cleanNotes,
  };
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [tripToCancel, setTripToCancel] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadFromAPI = async () => {
      try {
        const res = await apiFetch('/me/customer');
        if (res.ok) {
          const result = await res.json();
          if (result.status === 'success' && result.data) {
            const customer = result.data;
            const reservations = customer.reservations || [];
            const rides = reservations.map((r: any) => ({
              id: `${customer.id}-${r.id}`,
              customerId: customer.id,
              reservationId: r.id,
              firstName: customer.first_name || '',
              lastName: customer.last_name || '',
              email: customer.email || '',
              phone: customer.phone || '',
              company: customer.company || '',
              customerType: customer.customer_type || '',
              transferType: r.transfer_type || '',
              vehicleType: r.vehicle_type || '',
              pickupLocation: r.pickup_location || '',
              dropoffLocation: r.dropoff_location || '',
              transferDate: r.transfer_date || '',
              transferTime: r.transfer_time || '',
              flightNumber: r.flight_number || '',
              passengers: r.passengers || 1,
              status: r.status || 'Confirmed',
              notes: r.notes || '',
              price: r.price,
            }));
            rides.sort((a: any, b: any) => {
              const t = (d: string) => d ? new Date(d).getTime() : 0;
              return t(b.transferDate) - t(a.transferDate);
            });
            if (window.location.search.includes('tab=Past')) setActiveTab('Past');
            setTrips(rides);
            return;
          }
        }
      } catch { /* fall through */ }

      // Fallback: localStorage
      const email = (localStorage.getItem('currentCustomerEmail') || '').toLowerCase().trim();
      const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
      const userRides = email
        ? customersDB.filter((c: any) => (c.email || '').toLowerCase().trim() === email)
        : [];
      userRides.sort((a: any, b: any) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime());
      if (window.location.search.includes('tab=Past')) setActiveTab('Past');
      setTrips(userRides);
    };

    loadFromAPI();
  }, []);

  // Lock body scroll when cancel modal is open
  useEffect(() => {
    if (tripToCancel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [tripToCancel]);

  const handleDownloadReceipt = (trip: any) => {
    const { basePrice, tipAmount, totalPrice, cardLast4 } = parseReservationPricing(trip);
    downloadInvoiceHtml({
      id: trip.id,
      pickupLocation: trip.pickupLocation,
      dropoffLocation: trip.dropoffLocation,
      transferDate: trip.transferDate,
      transferTime: trip.transferTime,
      transferType: trip.transferType || 'VIP Transfer',
      vehicleType: trip.vehicleType,
      passengers: trip.passengers || 1,
      flightNumber: trip.flightNumber,
      passengerName: `${trip.firstName || ''} ${trip.lastName || ''}`.trim() || 'Valued Customer',
      email: trip.email,
      phone: trip.phone,
      company: trip.company,
      status: trip.status || 'Confirmed',
      basePrice,
      tipAmount,
      totalPrice,
      cardLast4,
    }, `Invoice_INV_TR_${trip.id}.html`);
  };

  const handleConfirmCancel = async () => {
    if (!tripToCancel) return;
    setIsCancelling(true);

    try {
      const tripId = tripToCancel.id;
      const resId = tripToCancel.reservationId || (tripId && tripId.toString().includes('-') ? tripId.toString().split('-')[1] : null);
      const realId = tripToCancel.customerId || (tripId ? tripId.toString().split('-')[0] : '');

      // Update backend
      if (resId && resId !== '0') {
        await apiFetch(`/reservations/${resId}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'Cancelled' }),
        }).catch(err => console.error('Error cancelling reservation in backend:', err));
      } else if (realId) {
        await apiFetch(`/customers/${realId}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'Cancelled', reservation_id: resId }),
        }).catch(err => console.error('Error cancelling in backend:', err));
      }

      // Update localStorage customersDB
      const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
      const updatedDB = customersDB.map((c: any) => {
        if (c.id === tripId) {
          return { ...c, status: 'Cancelled' };
        }
        return c;
      });
      localStorage.setItem('customersDB', JSON.stringify(updatedDB));

      // Update state
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t));
      
      setCancelSuccessMsg(`Reservation #TR-${tripId} has been successfully cancelled.`);
      setTimeout(() => setCancelSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Cancellation error:', err);
    } finally {
      setIsCancelling(false);
      setTripToCancel(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'Completed': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Completed
          </span>
        );
      case 'In Transit': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Car className="w-3.5 h-3.5 text-amber-600" /> In Transit
          </span>
        );
      case 'Cancelled': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Pending
          </span>
        );
    }
  };

  const now = new Date().setHours(0, 0, 0, 0);
  const upcomingTrips = trips.filter(t => getTimestamp(t.transferDate) >= now && t.status !== 'Cancelled');
  const pastTrips = trips.filter(t => getTimestamp(t.transferDate) < now || t.status === 'Cancelled');
  const currentTabTrips = activeTab === 'Upcoming' ? upcomingTrips : pastTrips;

  const displayTrips = currentTabTrips.filter(t => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (t.pickupLocation || '').toLowerCase().includes(q) ||
      (t.dropoffLocation || '').toLowerCase().includes(q) ||
      (t.vehicleType || '').toLowerCase().includes(q) ||
      (t.flightNumber || '').toLowerCase().includes(q) ||
      (t.transferDate || '').includes(q) ||
      (t.id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto pb-16 pt-2 animate-in fade-in duration-200">
      
      {/* Toast Message */}
      {cancelSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-sm shadow-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{cancelSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setCancelSuccessMsg(null)}
            className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Trips</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage your scheduled and past transfers.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('Upcoming')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'Upcoming'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('Past')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'Past'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past ({pastTrips.length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by location, vehicle, flight number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all"
        />
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {displayTrips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {search ? 'No matching trips found' : `No ${activeTab.toLowerCase()} trips`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {search 
                ? 'Try searching with a different keyword or location.'
                : `You don't have any ${activeTab.toLowerCase()} transfers at the moment.`}
            </p>
          </div>
        ) : (
          <>
            {displayTrips.slice(0, visibleCount).map((trip: any) => {
              const { day, month } = formatDateBadge(trip.transferDate);
              const pricing = parseReservationPricing(trip);
              const { summary, specialRequests } = parseNotes(trip.notes);
              const canCancel = trip.status !== 'Cancelled' && trip.status !== 'Completed';

              return (
                <div 
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row gap-5 items-stretch"
                >
                  {/* Left: Dark Navy Date & Time Block */}
                  <div className="w-full md:w-32 shrink-0 bg-slate-900 text-white p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
                    <p className="text-[#aa2d29] font-bold text-xs uppercase tracking-wider">
                      {month || 'DATE'}
                    </p>
                    <p className="text-3xl sm:text-4xl font-heading font-black text-white leading-none my-1">
                      {day || '--'}
                    </p>
                    <p className="text-slate-300 font-semibold text-xs mt-0.5">
                      {trip.transferTime || '12:00'}
                    </p>
                  </div>

                  {/* Right: Trip Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    
                    {/* Top Row: Ref, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-slate-900">#TR-{trip.id}</span>
                        {trip.company && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-[#aa2d29]">{trip.company}</span>
                          </>
                        )}
                      </div>

                      <div>
                        {getStatusBadge(trip.status)}
                      </div>
                    </div>

                    {/* Middle: Route and Booking Info */}
                    <div className="py-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      
                      {/* Route Details */}
                      <div className="md:col-span-7 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <div>
                            <span className="text-[11px] font-medium text-slate-400 block">Pick-up</span>
                            <span className="text-sm font-semibold text-slate-900 block leading-snug">
                              {trip.pickupLocation || 'Not specified'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#aa2d29] mt-1.5 shrink-0" />
                          <div>
                            <span className="text-[11px] font-medium text-slate-400 block">Drop-off</span>
                            <span className="text-sm font-semibold text-slate-900 block leading-snug">
                              {trip.dropoffLocation || 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Booking Meta Information Box */}
                      <div className="md:col-span-5 bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                        <div className="flex justify-between items-center text-slate-600">
                          <span>Vehicle:</span>
                          <span className="font-semibold text-slate-900">{trip.vehicleType || 'Sedan'}</span>
                        </div>

                        <div className="flex justify-between items-center text-slate-600">
                          <span>Passengers:</span>
                          <span className="font-semibold text-slate-900">{trip.passengers || 1} Pax</span>
                        </div>

                        {trip.flightNumber && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="flex items-center gap-1"><Plane className="w-3 h-3 text-slate-400" /> Flight:</span>
                            <span className="font-semibold font-mono text-slate-900">{trip.flightNumber}</span>
                          </div>
                        )}

                        <div className="border-t border-slate-200/80 pt-1.5 flex justify-between items-center">
                          <span className="text-slate-600">Total Price:</span>
                          <span className="text-sm font-bold text-slate-900">
                            ${pricing.totalPrice.toFixed(2)}
                            {pricing.tipAmount > 0 && (
                              <span className="text-[10px] text-slate-400 font-normal ml-1">
                                (incl. tip)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Extra Notes / Preferences (if any) */}
                    {(summary || specialRequests) && (
                      <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 mb-3 border border-slate-100 space-y-0.5">
                        {summary && (
                          <div>
                            <span className="font-medium text-slate-500">Preferences: </span>
                            <span className="text-slate-800">{summary}</span>
                          </div>
                        )}
                        {specialRequests && (
                          <div>
                            <span className="font-medium text-slate-500">Note: </span>
                            <span className="text-slate-800">{specialRequests}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Bar: Passenger info, Download Receipt & Cancel Trip Button */}
                    <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="text-xs text-slate-500">
                        Passenger: <span className="font-medium text-slate-800">{trip.firstName} {trip.lastName}</span>
                        {trip.phone && <span> • {trip.phone}</span>}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
                        {canCancel && (
                          <button
                            onClick={() => setTripToCancel(trip)}
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex-1 sm:flex-none"
                          >
                            <span>Cancel Trip</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDownloadReceipt(trip)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex-1 sm:flex-none"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>Download Receipt</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}

            {displayTrips.length > visibleCount && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                  Show More (+{displayTrips.length - visibleCount})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CONFIRM CANCELLATION MODAL */}
      {tripToCancel && (
        <div 
          onClick={() => !isCancelling && setTripToCancel(null)}
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150 text-slate-800"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Cancel Reservation</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel booking <strong className="text-slate-800 font-mono">#TR-{tripToCancel.id}</strong>?
              </p>
            </div>

            {/* Trip summary box */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Date & Time:</span>
                <span className="font-semibold text-slate-900">{tripToCancel.transferDate} at {tripToCancel.transferTime || '12:00'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vehicle:</span>
                <span className="font-semibold text-slate-900">{tripToCancel.vehicleType}</span>
              </div>
              <div className="border-t border-slate-200/80 pt-2 text-slate-600 space-y-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">From:</span>
                  <span className="font-medium text-slate-800 block truncate">{tripToCancel.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">To:</span>
                  <span className="font-medium text-slate-800 block truncate">{tripToCancel.dropoffLocation}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Once cancelled, this trip will move to your Past History as Cancelled.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setTripToCancel(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
