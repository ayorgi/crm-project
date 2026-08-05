'use client';
import React from 'react';
import { Car, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VEHICLES } from '@/lib/constants';

interface Step2VehicleVipProps {
  passengers: string;
  selectedVehicle: string;
  setSelectedVehicle: (val: string) => void;
  quietRide: string;
  setQuietRide: (val: string) => void;
  temperature: string;
  setTemperature: (val: string) => void;
  childSeat: string;
  setChildSeat: (val: string) => void;
  specialRequests: string;
  setSpecialRequests: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const inpClass =
  'w-full h-12 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 flex items-center justify-between';

export function Step2VehicleVip({
  passengers,
  selectedVehicle,
  setSelectedVehicle,
  quietRide,
  setQuietRide,
  temperature,
  setTemperature,
  childSeat,
  setChildSeat,
  specialRequests,
  setSpecialRequests,
  onBack,
  onNext,
}: Step2VehicleVipProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <Car className="w-5 h-5 text-[#aa2d29]" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Step 2: Select Vehicle & VIP Preferences</h2>
          <p className="text-xs text-slate-500">Choose your VIP vehicle class and configure your cabin experience.</p>
        </div>
      </div>

      {/* Vehicle Selection Cards */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Select Vehicle Class *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VEHICLES.map(v => {
            const pCount = parseInt(passengers || '1', 10);
            const isCapacityExceeded = pCount > (v.maxPax || 6);
            const isSelected = selectedVehicle === v.id && !isCapacityExceeded;

            return (
              <div
                key={v.id}
                onClick={() => {
                  if (!isCapacityExceeded) {
                    setSelectedVehicle(v.id);
                  }
                }}
                className={`p-5 rounded-2xl border-2 transition-all select-none ${
                  isCapacityExceeded
                    ? 'opacity-40 cursor-not-allowed bg-slate-100/90 border-slate-200'
                    : isSelected
                    ? 'border-[#aa2d29] bg-rose-50/40 shadow-xs cursor-pointer'
                    : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Car
                      className={`w-4 h-4 ${
                        isSelected ? 'text-[#aa2d29]' : isCapacityExceeded ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    />
                    <span className={isCapacityExceeded ? 'text-slate-500 line-through decoration-slate-400' : ''}>
                      {v.name}
                    </span>
                  </h3>
                  <span className={`font-black text-base ${isCapacityExceeded ? 'text-slate-400' : 'text-[#aa2d29]'}`}>
                    {v.price}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{v.desc}</p>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span
                    className={`px-2.5 py-1 rounded-md border ${
                      isCapacityExceeded
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {isCapacityExceeded ? `Max ${v.maxPax} Pax (Over Capacity)` : v.pax}
                  </span>
                  <span
                    className={
                      isCapacityExceeded
                        ? 'text-rose-500 font-semibold'
                        : isSelected
                        ? 'text-[#aa2d29] font-black'
                        : 'text-slate-400'
                    }
                  >
                    {isCapacityExceeded ? `Not available for ${pCount} pax` : isSelected ? '✓ Selected' : 'Click to select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIP Cabin Preferences */}
      <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
            VIP Cabin & Comfort Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quiet Ride */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              Quiet Ride Mode
            </label>
            <Select value={quietRide} onValueChange={val => setQuietRide(val || '')}>
              <SelectTrigger className={inpClass.replace('bg-slate-50/80', 'bg-white')}>
                <SelectValue placeholder="Select quiet ride mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes (Silent Cabin - No Small Talk)</SelectItem>
                <SelectItem value="No">No (Standard Friendly Chauffeur)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              Cabin AC Climate
            </label>
            <Select value={temperature} onValueChange={val => setTemperature(val || '')}>
              <SelectTrigger className={inpClass.replace('bg-slate-50/80', 'bg-white')}>
                <SelectValue placeholder="Select cabin temperature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20°C">20°C (Cool & Fresh)</SelectItem>
                <SelectItem value="21°C">21°C (Optimal Climate)</SelectItem>
                <SelectItem value="22°C">22°C (Warm Comfort)</SelectItem>
                <SelectItem value="23°C">23°C (Cozy Warm)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Child Seat */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Child / Baby Seat
            </label>
            <Select value={childSeat} onValueChange={val => setChildSeat(val || '')}>
              <SelectTrigger className={inpClass.replace('bg-slate-50/80', 'bg-white')}>
                <SelectValue placeholder="Select child seat option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None (Adult Passengers)</SelectItem>
                <SelectItem value="1 Infant Seat">1 Infant Seat (0-12 Months)</SelectItem>
                <SelectItem value="1 Child Seat">1 Child Safety Seat (1-4 Yrs)</SelectItem>
                <SelectItem value="1 Booster Seat">1 Booster Seat (4-8 Yrs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Special Requests / Refreshments
          </label>
          <textarea
            placeholder="e.g. Still mineral water, Wi-Fi password details..."
            value={specialRequests}
            onChange={e => setSpecialRequests(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-[#aa2d29] outline-none h-24 resize-none text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Navigation Footer for Step 2 */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Route</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="bg-[#aa2d29] hover:bg-[#8e2622] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-[#aa2d29]/20 text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>Passenger Contact Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
