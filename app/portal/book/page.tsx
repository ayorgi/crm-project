'use client';
import React, { useState, useEffect } from 'react';
import { formatDDMMYYYY } from '@/lib/dateUtils';
import { useRouter } from 'next/navigation';
import { MapPin, CheckCircle2, User, ArrowLeftRight, Calendar, Car, Sparkles, Users, Info, Plane } from 'lucide-react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectSeparator } from '@/components/ui/select';

const VEHICLES = [
  { id: 'VIP Business Van', name: 'VIP Business Van', pax: '1-6', price: '$150' },
  { id: 'Executive Sedan', name: 'Executive Sedan', pax: '1-3', price: '$120' },
  { id: 'Premium SUV', name: 'Premium SUV', pax: '1-4', price: '$200' },
  { id: 'First Class Sedan', name: 'First Class Sedan', pax: '1-2', price: '$300' },
];


const LOCATION_GROUPS = [
    {
        label: 'Airports',
        items: ['Ercan International Airport', 'Larnaca International Airport', 'Paphos Airport'].sort()
    },
    {
        label: 'Cities & Regions',
        items: [
            'Bafra Resort Area', 'Gazimağusa (Famagusta) City Centre', 'Girne (Kyrenia) City Centre',
            'Güzelyurt (Morphou)', 'İskele (Trikomo)', 'Lefkoşa (Nicosia) City Centre', 'Long Beach Area'
        ].sort()
    },
    {
        label: 'Hotels & Resorts',
        items: [
            'Acapulco Resort', 'Arkın Iskele Hotel', 'Concorde Luxury Resort', 'Cratos Premium Hotel',
            'Elexus Hotel Resort', 'Kaya Palazzo Resort', 'Les Ambassadeurs', 'Limak Cyprus Deluxe',
            "Lord's Palace Hotel", 'Merit Royal Diamond'
        ].sort()
    }
];

export default function BookTransferPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState('VIP Business Van');
  const [flight, setFlight] = useState('');
  const [pax, setPax] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileMissing, setProfileMissing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [hasPrefilled, setHasPrefilled] = useState(false);

  const formatDisplayDate = (d: string) => {
    if (!d) return '';
    if (d.includes('-')) {
      const [y, m, day] = d.split('-');
      if (y && m && day && y.length === 4) return `${day}/${m}/${y}`;
    }
    return d;
  };

  useEffect(() => {
    const name = localStorage.getItem('currentCustomer') || 'Guest';
    setCustomerName(name);

    const profile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    if (!profile.firstName || !profile.email) {
      setProfileMissing(true);
    } else {
      if (profile.preferredVehicle) {
        setVehicle(profile.preferredVehicle);
        setHasPrefilled(true);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleSwap = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff || !date || !time) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
      
      const profile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
      
      const newBooking = {
        id: Date.now(),
        firstName: profile.firstName || customerName.split(' ')[0] || customerName,
        lastName: profile.lastName || customerName.split(' ')[1] || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        customerType: profile.company ? 'Corporate Agency' : 'Individual VIP',
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        transferDate: formatDDMMYYYY(date),
        transferTime: time,
        vehicleType: vehicle,
        transferType: 'Airport Transfer',
        flightNumber: flight,
        passengers: pax || '1',
        notes: notes,
        status: 'Pending',
        createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      
      customersDB.unshift(newBooking);
      localStorage.setItem('customersDB', JSON.stringify(customersDB));
      
      setSuccess(true);
      setIsSubmitting(false);
    }, 1000);
  };

  if (!isLoaded) return null;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-heading font-black text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h1>
        <p className="text-xl text-gray-500 mb-10">Your transfer request has been successfully submitted. We will review it shortly.</p>
        <div className="flex gap-4">
          <button onClick={() => router.push('/portal/trips')} className="bg-[#aa2d29] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#8e2622] shadow-md">
            View My Trips
          </button>
          <button onClick={() => router.push('/portal')} className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50">
            Return to Portal
          </button>
        </div>
      </div>
    );
  }

  if (profileMissing) {
    return (
      <div className="max-w-2xl mx-auto py-20 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <User className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-heading font-black text-gray-900 mb-4 tracking-tight">Profile Required</h1>
        <p className="text-xl text-gray-500 mb-10">Please complete your profile details first before booking a transfer. This helps us provide you with the best VIP experience.</p>
        <button onClick={() => router.push('/portal/profile')} className="bg-[#aa2d29] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#8e2622] shadow-md">
          Setup My Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl text-gray-900 font-heading font-bold tracking-tight">Book a Transfer</h1>
        <p className="text-gray-500 mt-2 text-lg">Schedule your premium ride in seconds.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft p-8 md:p-12 space-y-8">
        {/* Route Details */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#aa2d29]" /> Route
            </h2>
            <button
              type="button"
              onClick={handleSwap}
              className="text-xs font-bold text-[#aa2d29] hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Locations
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pick-up Location *</label>
              <Select value={pickup} onValueChange={val => setPickup(val === 'none' || !val ? '' : val)}>
                <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] outline-none">
                  <SelectValue placeholder="Select pick-up point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-gray-400 italic">-- Clear Selection --</SelectItem>
                  {LOCATION_GROUPS.map((group, i) => (
                    <SelectGroup key={group.label}>
                      {i > 0 && <SelectSeparator />}
                      <SelectLabel className="font-bold text-[11px] text-gray-500 uppercase tracking-widest bg-gray-50/50 px-2 py-1.5">{group.label}</SelectLabel>
                      {group.items.map(o => <SelectItem key={o} value={o} className="pl-4">{o}</SelectItem>)}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Drop-off Location *</label>
              <Select value={dropoff} onValueChange={val => setDropoff(val === 'none' || !val ? '' : val)}>
                <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] outline-none">
                  <SelectValue placeholder="Select drop-off point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-gray-400 italic">-- Clear Selection --</SelectItem>
                  {LOCATION_GROUPS.map((group, i) => (
                    <SelectGroup key={group.label}>
                      {i > 0 && <SelectSeparator />}
                      <SelectLabel className="font-bold text-[11px] text-gray-500 uppercase tracking-widest bg-gray-50/50 px-2 py-1.5">{group.label}</SelectLabel>
                      {group.items.map(o => <SelectItem key={o} value={o} className="pl-4">{o}</SelectItem>)}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Date & Time */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#aa2d29]" /> Date & Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formatDisplayDate(date)}
                  readOnly
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] outline-none relative z-0 cursor-pointer text-sm font-medium"
                />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  onClick={e => { try { e.currentTarget.showPicker(); } catch (err) { } }}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Time *</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] outline-none text-sm font-medium" />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Vehicle Selection */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Car className="w-4 h-4 text-[#aa2d29]" /> Select Vehicle
            </h2>
            {hasPrefilled && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" /> Pre-filled from VIP Profile
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VEHICLES.map(v => (
              <div 
                key={v.id} 
                onClick={() => setVehicle(v.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${vehicle === v.id ? 'border-[#aa2d29] bg-[#aa2d29]/5' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-gray-900">{v.price}</span>
                </div>
                <h3 className="font-bold text-gray-900">{v.name}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Users className="w-3 h-3" /> {v.pax} pax</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Extra Details */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#aa2d29]" /> Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Flight Number <span className="text-xs text-gray-400 font-normal">(Optional - Airport Only)</span>
              </label>
              <div className="relative">
                <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="e.g. TK 960 (Leave blank if not applicable)" value={flight} onChange={e => setFlight(e.target.value)} className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] outline-none font-medium text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Passengers</label>
              <Select value={pax} onValueChange={val => setPax(val === 'none' || !val ? '' : val)}>
                <SelectTrigger className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] outline-none font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400 shrink-0" />
                    <SelectValue placeholder="Select # of passengers" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-gray-400 italic">-- Clear Selection --</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? 'passenger' : 'passengers'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Special Requests / Notes</label>
            <textarea placeholder="e.g. Baby seat required..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] outline-none h-24 resize-none" />
          </div>
        </section>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#aa2d29] hover:bg-[#8e2622]'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </div>

      </form>
    </div>
  );
}
