'use client';
import React from 'react';
import { User, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Step3PassengerProps {
  salutation: string;
  setSalutation: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  contactMethod: 'Phone' | 'WhatsApp' | '';
  setContactMethod: (val: 'Phone' | 'WhatsApp' | '') => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  transferType: string;
  flightNumber: string;
  setFlightNumber: (val: string) => void;
  meetGreetName: string;
  setMeetGreetName: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const inpClass =
  'w-full h-12 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 flex items-center justify-between';

export function Step3Passenger({
  salutation,
  setSalutation,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  contactMethod,
  setContactMethod,
  phoneNumber,
  setPhoneNumber,
  transferType,
  flightNumber,
  setFlightNumber,
  meetGreetName,
  setMeetGreetName,
  onBack,
  onNext,
}: Step3PassengerProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <User className="w-5 h-5 text-[#aa2d29]" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Step 3: Passenger & Contact Information</h2>
          <p className="text-xs text-slate-500">Provide passenger details and preferred contact channel for driver updates.</p>
        </div>
      </div>

      {/* Salutation, First Name, Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Title / Salutation *
          </label>
          <Select value={salutation} onValueChange={val => setSalutation(val || '')}>
            <SelectTrigger className={inpClass}>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr.">Mr.</SelectItem>
              <SelectItem value="Mrs.">Mrs.</SelectItem>
              <SelectItem value="Ms.">Ms.</SelectItem>
              <SelectItem value="Dr.">Dr.</SelectItem>
              <SelectItem value="Prof.">Prof.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">First Name *</label>
          <input
            required
            type="text"
            placeholder="e.g. Arda"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className={inpClass}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name *</label>
          <input
            required
            type="text"
            placeholder="e.g. Şahin"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className={inpClass}
          />
        </div>
      </div>

      {/* Preferred Contact Method & Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Preferred Contact Method *
          </label>
          <Select value={contactMethod} onValueChange={(val: any) => setContactMethod(val || '')}>
            <SelectTrigger className={inpClass}>
              <SelectValue placeholder="Select contact method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WhatsApp">WhatsApp Message (Recommended)</SelectItem>
              <SelectItem value="Phone">Direct Phone Call</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            {contactMethod || 'Contact'} Number *
          </label>
          <input
            required
            type="text"
            placeholder="+90 533 000 0000"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className={inpClass}
          />
        </div>
      </div>

      {/* Flight Number & Meet & Greet Name (Only for Airport Transfers) */}
      {transferType === 'Airport Transfer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              Flight Number *
            </label>
            <input
              type="text"
              placeholder="e.g. TK 1921"
              value={flightNumber}
              onChange={e => setFlightNumber(e.target.value)}
              className={inpClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              Airport Meet Signage Name
            </label>
            <input
              type="text"
              placeholder="Defaults to Passenger Name if blank"
              value={meetGreetName}
              onChange={e => setMeetGreetName(e.target.value)}
              className={inpClass}
            />
          </div>
        </div>
      )}

      {/* Navigation Footer for Step 3 */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vehicle</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="bg-[#aa2d29] hover:bg-[#8e2622] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-[#aa2d29]/20 text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
