'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Building2,
  Car,
  MapPin,
  Plane,
  Info,
  Calendar,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';
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
import { isAirport } from '@/lib/bookingUtils';
import { formatDisplayDate } from '@/lib/bookingNotesUtils';
import {
  PARTNERS,
  LOCATION_GROUPS,
  VEHICLES,
  TRANSFER_TYPES,
  STATUSES,
  PAX_OPTIONS,
  TIME_INTERVALS_15,
} from '@/lib/constants';

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  customerType: string;
  vehicleType: string;
  transferType: string;
  pickupLocation: string;
  dropoffLocation: string;
  transferDate: string;
  transferTime: string;
  flightNumber: string;
  passengers: string;
  notes: string;
  status: string;
}

interface CustomerFormModalProps {
  isOpen: boolean;
  isDuplicate?: boolean;
  title?: string;
  value: BookingFormData;
  onChange: (key: string, val: string) => void;
  onSave: () => void;
  onClose: () => void;
  saveLabel?: string;
}

const inp =
  'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400';

const F = ({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) => (
  <div className={`flex flex-col gap-1.5 w-full${span2 ? ' md:col-span-2' : ''}`}>
    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

export function CustomerFormModal({
  isOpen,
  isDuplicate,
  title,
  value: v,
  onChange: onChangeProp,
  onSave,
  onClose,
  saveLabel,
}: CustomerFormModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setStepError(null);
    }
  }, [isOpen]);

  const set = (key: string, val: string) => {
    setStepError(null);
    onChangeProp(key, val);
    if (key === 'company') {
      onChangeProp('customerType', val && val !== 'none' ? 'B2B Partner' : 'Individual VIP');
    }
    if (key === 'transferType' && val !== 'Airport Transfer') {
      onChangeProp('flightNumber', '');
    }
    if (key === 'passengers') {
      const pCount = parseInt(val || '1', 10);
      const curVeh = VEHICLES.find(veh => veh.id === v.vehicleType);
      if (curVeh && pCount > curVeh.maxPax) {
        onChangeProp('vehicleType', '');
      }
    }
  };

  useEffect(() => {
    const hasAirport = isAirport(v.pickupLocation || '') || isAirport(v.dropoffLocation || '');
    if (hasAirport && v.transferType !== 'Airport Transfer') {
      onChangeProp('transferType', 'Airport Transfer');
    } else if (!hasAirport && v.transferType === 'Airport Transfer') {
      onChangeProp('transferType', '');
    }
    if (!hasAirport && v.flightNumber) {
      onChangeProp('flightNumber', '');
    }
  }, [v.pickupLocation, v.dropoffLocation]);

  if (!isOpen) return null;

  const sel = (key: keyof BookingFormData, opts: string[], placeholder: string) => (
    <Select value={v[key]} onValueChange={val => set(key as string, val === 'none' || !val ? '' : val)}>
      <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="none" className="text-gray-400 italic">
            -- Clear Selection --
          </SelectItem>
          {opts.map(o => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  const passengerSel = () => (
    <Select
      value={v.passengers || '1'}
      onValueChange={val => set('passengers', val || '1')}
    >
      <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
        <SelectValue placeholder="Select # of passengers" />
      </SelectTrigger>
      <SelectContent>
        {PAX_OPTIONS.map(n => (
          <SelectItem key={n} value={n}>
            {n} {n === '1' ? 'passenger' : 'passengers'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const vehicleSel = () => {
    const pCount = parseInt(v.passengers || '1', 10);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {VEHICLES.map(veh => {
          const isExceeded = pCount > veh.maxPax;
          const isSelected = v.vehicleType === veh.id && !isExceeded;
          return (
            <div
              key={veh.id}
              onClick={() => {
                if (!isExceeded) {
                  set('vehicleType', veh.id);
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all select-none ${
                isExceeded
                  ? 'opacity-40 cursor-not-allowed bg-gray-100/90 border-gray-200'
                  : isSelected
                  ? 'border-[#aa2d29] bg-rose-50/50 shadow-sm cursor-pointer'
                  : 'border-gray-200 bg-gray-50/60 hover:border-gray-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-bold flex items-center gap-1.5 ${isSelected ? 'text-[#aa2d29]' : 'text-gray-800'}`}>
                  <Car className="w-4 h-4" />
                  <span className={isExceeded ? 'line-through text-gray-400' : ''}>{veh.name}</span>
                </span>
                <span className={`font-black text-sm ${isSelected ? 'text-[#aa2d29]' : 'text-gray-700'}`}>
                  {veh.price}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{veh.desc}</p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-gray-400">Capacity: {veh.pax}</span>
                {isExceeded && <span className="text-red-500 font-bold">Max {veh.maxPax} pax</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const locationSel = (key: keyof BookingFormData, placeholder: string) => (
    <Select value={v[key]} onValueChange={val => set(key as string, val === 'none' || !val ? '' : val)}>
      <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" className="text-gray-400 italic">
          -- Clear Selection --
        </SelectItem>
        {LOCATION_GROUPS.map((group, i) => (
          <SelectGroup key={group.label}>
            {i > 0 && <SelectSeparator />}
            <SelectLabel className="font-bold text-[11px] text-gray-500 uppercase tracking-widest bg-gray-50/50 px-2 py-1.5">
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
  );

  const ADMIN_STATUSES = ['Confirmed', 'Pending'];

  const statusSel = () => (
    <Select
      value={v.status || 'Confirmed'}
      onValueChange={val => set('status', val || 'Confirmed')}
    >
      <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
        <SelectValue placeholder="Confirmed" />
      </SelectTrigger>
      <SelectContent>
        {ADMIN_STATUSES.map(o => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const hasAirport = isAirport(v.pickupLocation || '') || isAirport(v.dropoffLocation || '');
  const selectedVehicleObj = VEHICLES.find(veh => veh.id === v.vehicleType);

  const validateStep = () => {
    setStepError(null);
    if (step === 1) {
      if (!v.firstName.trim() || !v.lastName.trim()) {
        setStepError('Please enter both First Name and Last Name to continue.');
        return false;
      }
    }
    if (step === 2) {
      if (!v.pickupLocation || !v.dropoffLocation) {
        setStepError('Please select both Pick-up and Drop-off locations.');
        return false;
      }
    }
    if (step === 3) {
      if (!v.vehicleType) {
        setStepError('Please select an eligible vehicle class.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 5) setStep((step + 1) as any);
    }
  };

  const handleBack = () => {
    setStepError(null);
    if (step > 1) setStep((step - 1) as any);
  };

  const stepLabels = [
    { num: 1, title: 'Guest', desc: 'Personal info' },
    { num: 2, title: 'Route', desc: 'Locations & time' },
    { num: 3, title: 'Vehicle', desc: 'Class & requests' },
    { num: 4, title: 'Status', desc: 'State & pricing' },
    { num: 5, title: 'Review', desc: 'Final check' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-gray-900">
              {title || (isDuplicate ? 'Duplicate Guest' : 'New Reservation')}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Part {step} of 5 — {stepLabels[step - 1].title} Details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Wizard Progress Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {stepLabels.map((s, idx) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <React.Fragment key={s.num}>
                  <div
                    onClick={() => {
                      if (s.num < step) setStep(s.num as any);
                    }}
                    className={`flex items-center gap-2 transition-all select-none ${
                      s.num <= step ? 'cursor-pointer' : 'cursor-default'
                    } ${isCurrent ? 'opacity-100' : isDone ? 'opacity-90' : 'opacity-40'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#aa2d29] text-white shadow-md ring-2 ring-[#aa2d29]/40'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-[11px] font-bold text-white leading-tight">{s.title}</p>
                    </div>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <div
                      className={`h-[2px] flex-1 mx-2 transition-all ${
                        step > s.num ? 'bg-emerald-600/80' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 md:p-8 min-h-[320px]">
          {stepError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {stepError}
            </div>
          )}

          {/* PART 1: GUEST INFORMATION */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#aa2d29]">
                <User className="w-4 h-4" />
                <h4 className="text-sm font-bold text-gray-900">Step 1: Guest Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <F label="First Name *">
                  <input
                    type="text"
                    placeholder="e.g. James"
                    value={v.firstName}
                    onChange={e => set('firstName', e.target.value)}
                    className={inp}
                  />
                </F>
                <F label="Last Name *">
                  <input
                    type="text"
                    placeholder="e.g. Robertson"
                    value={v.lastName}
                    onChange={e => set('lastName', e.target.value)}
                    className={inp}
                  />
                </F>
                <F label="Email Address">
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={v.email}
                    onChange={e => set('email', e.target.value)}
                    className={inp}
                  />
                </F>
                <F label="Phone Number">
                  <input
                    type="text"
                    placeholder="+44 7700 000000"
                    value={v.phone}
                    onChange={e => set('phone', e.target.value)}
                    className={inp}
                  />
                </F>
                <F label="B2B Partner (Hotel / Agency)">
                  {sel('company', PARTNERS, 'Select partner or leave blank')}
                </F>
                <F label="Guest Type">
                  <input
                    className={inp + ' bg-gray-100/80 text-gray-500 font-semibold cursor-not-allowed'}
                    value={v.customerType}
                    readOnly
                    title="Auto-calculated based on B2B Partner"
                  />
                </F>
              </div>
            </div>
          )}

          {/* PART 2: ROUTE & SCHEDULE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#aa2d29]">
                <MapPin className="w-4 h-4" />
                <h4 className="text-sm font-bold text-gray-900">Step 2: Route, Schedule & Passengers</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <F label="Pick-up Location *">{locationSel('pickupLocation', 'Select pick-up point')}</F>
                <F label="Drop-off Location *">{locationSel('dropoffLocation', 'Select drop-off point')}</F>

                <F label="Transfer Type" span2>
                  <div className="flex flex-col gap-1">
                    <Select
                      value={v.transferType}
                      onValueChange={val => set('transferType', val === 'none' || !val ? '' : val)}
                      disabled={hasAirport}
                    >
                      <SelectTrigger
                        className={`${inp} ${
                          hasAirport
                            ? 'opacity-80 bg-gray-100 cursor-not-allowed text-gray-600'
                            : 'bg-gray-50'
                        }`}
                      >
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="text-gray-400 italic">
                          -- Clear Selection --
                        </SelectItem>
                        {TRANSFER_TYPES.map(o => (
                          <SelectItem
                            key={o}
                            value={o}
                            disabled={o === 'Airport Transfer' && !hasAirport}
                            className={
                              o === 'Airport Transfer' && !hasAirport
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }
                          >
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {hasAirport && (
                      <span className="text-[11px] text-[#aa2d29] font-medium">
                        (Auto-set for Airport route)
                      </span>
                    )}
                  </div>
                </F>

                <F label="Transfer Date">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formatDisplayDate(v.transferDate)}
                      readOnly
                      className={`${inp} relative z-0 cursor-pointer`}
                    />
                    <input
                      type="date"
                      value={v.transferDate}
                      onChange={e => set('transferDate', e.target.value)}
                      onClick={e => {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {}
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                  </div>
                </F>

                {/* Transfer Time - 15 minute interval dropdown */}
                <F label="Transfer Time">
                  <Select value={v.transferTime} onValueChange={val => set('transferTime', val || '')}>
                    <SelectTrigger className={inp}>
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
                </F>

                <F label="Passengers">{passengerSel()}</F>

                {v.transferType === 'Airport Transfer' ? (
                  <F label="Flight Number">
                    <div className="relative">
                      <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. TK 960, PC 1932"
                        value={v.flightNumber}
                        onChange={e => set('flightNumber', e.target.value)}
                        className={inp + ' pl-10'}
                      />
                    </div>
                  </F>
                ) : (
                  <F label="Flight Number">
                    <div className="relative">
                      <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="text"
                        placeholder="Not applicable for this route"
                        value=""
                        disabled
                        className={inp + ' pl-10 bg-gray-100/80 text-gray-400 cursor-not-allowed'}
                      />
                    </div>
                  </F>
                )}
              </div>
            </div>
          )}

          {/* PART 3: VEHICLE CLASS & VIP PREFERENCES */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#aa2d29]">
                <Car className="w-4 h-4" />
                <h4 className="text-sm font-bold text-gray-900">Step 3: Select Vehicle & VIP Details</h4>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                  Choose Vehicle Class *
                </label>
                {vehicleSel()}
              </div>
              <F label="Special Requests / VIP Notes" span2>
                <textarea
                  placeholder="e.g. Baby seat required, champagne on arrival, meet & greet with name board..."
                  value={v.notes}
                  onChange={e => set('notes', e.target.value)}
                  className={inp + ' resize-none h-20'}
                />
              </F>
            </div>
          )}

          {/* PART 4: STATUS & PRICING */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#aa2d29]">
                <Building2 className="w-4 h-4" />
                <h4 className="text-sm font-bold text-gray-900">Step 4: Reservation Status & Dispatch Pricing</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <F label="Reservation Status *">
                  {statusSel()}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Defaults to Confirmed. Set to Pending if awaiting payment or confirmation.
                  </p>
                </F>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Base Vehicle Fare:</span>
                    <span className="font-semibold text-gray-800">{selectedVehicleObj?.price || '$150.00'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">Estimated Total:</span>
                    <span className="text-base font-bold text-[#aa2d29]">{selectedVehicleObj?.price || '$150.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PART 5: REVIEW & CONFIRMATION (Clean, Minimalist Admin Summary) */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#aa2d29]">
                <Check className="w-4 h-4" />
                <h4 className="text-sm font-bold text-gray-900">Step 5: Review & Confirmation</h4>
              </div>

              {/* Clean Minimal Admin Card */}
              <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-3.5 text-xs text-gray-700">
                {/* Guest & Status Row */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Guest</span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {v.firstName} {v.lastName}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {v.email || 'No email'} {v.phone ? `• ${v.phone}` : ''} {v.company ? `(${v.company})` : ''}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      v.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {v.status || 'Confirmed'}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 pt-0.5">
                  <div className="bg-white p-3 rounded-xl border border-gray-200/80">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pick-up Location</span>
                    <span className="font-semibold text-gray-800 mt-0.5 block truncate" title={v.pickupLocation}>
                      {v.pickupLocation || '-'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Drop-off Location</span>
                    <span className="font-semibold text-gray-800 mt-0.5 block truncate" title={v.dropoffLocation}>
                      {v.dropoffLocation || '-'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date & Time</span>
                    <span className="font-semibold text-gray-800 mt-0.5 block">
                      {formatDisplayDate(v.transferDate) || 'TBD'} at {v.transferTime || '12:00'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200/80">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Vehicle & Passengers</span>
                    <span className="font-semibold text-gray-800 mt-0.5 block">
                      {v.vehicleType || 'VIP Business Van'} ({v.passengers || '1'} pax)
                    </span>
                  </div>
                </div>

                {/* Flight & Fare details */}
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    {v.flightNumber ? (
                      <span className="text-gray-600">
                        Flight Number: <strong className="text-gray-900">{v.flightNumber}</strong>
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No flight details</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 mr-2">Estimated Price:</span>
                    <span className="text-sm font-bold text-gray-900">{selectedVehicleObj?.price || '$150.00'}</span>
                  </div>
                </div>

                {v.notes && (
                  <div className="pt-2 border-t border-gray-200 text-xs text-gray-500 italic bg-white p-2.5 rounded-lg border border-gray-100">
                    Notes: "{v.notes}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-5 md:px-8 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between">
          <div>
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 bg-white hover:bg-gray-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#aa2d29] hover:bg-[#8e2622] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSave}
                className="bg-[#aa2d29] hover:bg-[#8e2622] text-white px-7 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{saveLabel || (isDuplicate ? 'Save Duplicate' : 'Create Reservation')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


