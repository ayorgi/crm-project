'use client';
import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import { LOCATION_GROUPS, AIRPORT_KEYWORDS, TIME_INTERVALS_15 } from '@/lib/constants';

interface Step1RouteDateProps {
  pickup: string;
  setPickup: (val: string) => void;
  dropoff: string;
  setDropoff: (val: string) => void;
  transferType: string;
  setTransferType: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  time: string;
  setTime: (val: string) => void;
  passengers: string;
  setPassengers: (val: string) => void;
  onNext: () => void;
}

const inpClass =
  'w-full h-12 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 flex items-center justify-between';

const isAirport = (loc: string) => AIRPORT_KEYWORDS.some(k => loc.includes(k));

const formatDisplayDate = (d: string) => {
  if (!d) return '';
  if (d.includes('-')) {
    const [y, m, day] = d.split('-');
    if (y && m && day && y.length === 4) return `${day}/${m}/${y}`;
  }
  return d;
};

export function Step1RouteDate({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  transferType,
  setTransferType,
  date,
  setDate,
  time,
  setTime,
  passengers,
  setPassengers,
  onNext,
}: Step1RouteDateProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-[#aa2d29]" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Step 1: Pick-up & Drop-off Details</h2>
            <p className="text-xs text-slate-500">Select your transfer route, schedule date, and passenger count.</p>
          </div>
        </div>
      </div>

      {/* Route Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pick-up Location */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Pick-up Location *
          </label>
          <Select value={pickup} onValueChange={val => setPickup(val === 'none' || !val ? '' : val)}>
            <SelectTrigger className={inpClass}>
              <SelectValue placeholder="Select pick-up point" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-slate-400 italic">
                -- Clear Selection --
              </SelectItem>
              {LOCATION_GROUPS.map((group, i) => (
                <SelectGroup key={group.label}>
                  {i > 0 && <SelectSeparator />}
                  <SelectLabel className="font-bold text-[11px] text-slate-500 uppercase tracking-widest bg-slate-50/50 px-2 py-1.5">
                    {group.label}
                  </SelectLabel>
                  {group.items.map(o => (
                    <SelectItem key={o} value={o} className="pl-4">
                      {o}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Drop-off Location */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Drop-off Location *
          </label>
          <Select value={dropoff} onValueChange={val => setDropoff(val === 'none' || !val ? '' : val)}>
            <SelectTrigger className={inpClass}>
              <SelectValue placeholder="Select drop-off point" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-slate-400 italic">
                -- Clear Selection --
              </SelectItem>
              {LOCATION_GROUPS.map((group, i) => (
                <SelectGroup key={group.label}>
                  {i > 0 && <SelectSeparator />}
                  <SelectLabel className="font-bold text-[11px] text-slate-500 uppercase tracking-widest bg-slate-50/50 px-2 py-1.5">
                    {group.label}
                  </SelectLabel>
                  {group.items.map(o => (
                    <SelectItem key={o} value={o} className="pl-4">
                      {o}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transfer Type Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
          <span>Transfer Type *</span>
          {(isAirport(pickup) || isAirport(dropoff)) && (
            <span className="text-[11px] text-[#aa2d29] font-semibold lowercase tracking-normal">
              (Auto-set for Airport route)
            </span>
          )}
        </label>
        <Select
          value={transferType}
          onValueChange={val => setTransferType(val === 'none' || !val ? '' : val)}
          disabled={isAirport(pickup) || isAirport(dropoff)}
        >
          <SelectTrigger
            className={`${inpClass} ${
              isAirport(pickup) || isAirport(dropoff) ? 'opacity-80 bg-slate-100 cursor-not-allowed' : ''
            }`}
          >
            <SelectValue placeholder="Select transfer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-slate-400 italic">
              -- Select Transfer Type --
            </SelectItem>
            <SelectItem value="Hotel & Resort Transfer">Hotel & Resort Transfer</SelectItem>
            <SelectItem value="Hourly Transportation">Hourly Transportation</SelectItem>
            <SelectItem
              value="Airport Transfer"
              disabled={!isAirport(pickup) && !isAirport(dropoff)}
              className={!isAirport(pickup) && !isAirport(dropoff) ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Airport Transfer
            </SelectItem>
            <SelectItem value="Point to Point">Point to Point</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date & Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Transfer Date *
          </label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={formatDisplayDate(date)}
              readOnly
              className={`${inpClass} relative z-0 cursor-pointer`}
            />
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              onClick={e => {
                try {
                  e.currentTarget.showPicker();
                } catch (err) {}
              }}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Transfer Time *
          </label>
          <Select value={time} onValueChange={val => setTime(val || '')}>
            <SelectTrigger className={inpClass}>
              <SelectValue placeholder="HH:MM" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {TIME_INTERVALS_15.map(t => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Passengers *
          </label>
          <Select value={passengers} onValueChange={val => setPassengers(val || '')}>
            <SelectTrigger className={inpClass}>
              <SelectValue placeholder="Select passengers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? 'passenger' : 'passengers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation Footer for Step 1 */}
      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="bg-[#aa2d29] hover:bg-[#8e2622] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-[#aa2d29]/20 text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>Choose a Vehicle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
