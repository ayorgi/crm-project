'use client';
import React from 'react';
import {
  User,
  Building2,
  Car,
  MapPin,
  CreditCard,
  Sparkles,
  MessageSquare,
  Copy,
  X,
} from 'lucide-react';
import { formatDisplayDate, parseBookingNotes } from '@/lib/bookingNotesUtils';

interface BookingDetailPanelProps {
  c: any;
  onClose: () => void;
  onDuplicate: () => void;
}

export function BookingDetailPanel({ c, onClose, onDuplicate }: BookingDetailPanelProps) {
  const fullName = c.firstName ? `${c.firstName} ${c.lastName}` : c.name;
  const hasTransfer = !!c.transferType;
  const parsedNotes = parseBookingNotes(c.notes);
  const displayTotal =
    parsedNotes.total ||
    (c.price ? Number(c.price).toFixed(2) : null) ||
    (parsedNotes.fare ? parsedNotes.fare.replace('$', '') : '0.00');

  const allSections = [
    {
      icon: <User className="w-3.5 h-3.5" />,
      title: 'Guest',
      fields: [
        ['Full Name', fullName],
        ['Email', c.email],
        ['Phone', c.phone],
        ['Guest Type', c.customerType],
      ],
    },
    ...(hasTransfer
      ? [
          {
            icon: <Building2 className="w-3.5 h-3.5" />,
            title: 'Booking',
            fields: [
              ['B2B Partner', c.company],
              ['Status', c.status],
              ['Passengers', c.passengers ? `${c.passengers} pax` : null],
              ['Booked On', formatDisplayDate(c.createdAt) || c.createdAt || null],
            ],
          },
          {
            icon: <Car className="w-3.5 h-3.5" />,
            title: 'Transfer',
            fields: [
              ['Vehicle', c.vehicleType],
              ['Type', c.transferType],
              ['Date', formatDisplayDate(c.transferDate)],
              ['Time', c.transferTime],
            ],
          },
          {
            icon: <MapPin className="w-3.5 h-3.5" />,
            title: 'Route',
            fields: [
              ['Pick-up', c.pickupLocation],
              ['Drop-off', c.dropoffLocation],
              ['Flight No.', c.flightNumber],
            ],
          },
        ]
      : []),
  ];
  const sections = allSections;

  return (
    <tr>
      <td
        colSpan={5}
        className="px-6 py-5 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100 space-y-4"
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Reservation Details
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onDuplicate}
              title="Duplicate Guest"
              className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          className={`grid gap-4 ${
            sections.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {sections.map(s => (
            <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[#aa2d29]">{s.icon}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {s.title}
                </span>
              </div>
              <div className="space-y-2">
                {s.fields
                  .filter(([, v]) => v)
                  .map(([label, val]) => (
                    <div key={label as string}>
                      <p className="text-[10px] text-gray-400 font-medium">{label as string}</p>
                      <p className="text-sm text-gray-800 font-semibold leading-tight">{val as string}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Structured Payment & Gratuity Card */}
        {(parsedNotes.payment || parsedNotes.fare || parsedNotes.tip || c.price) && (
          <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                  Payment & Billing
                </span>
                <p className="text-xs font-semibold text-gray-800">
                  {parsedNotes.payment || 'Direct Settlement'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs">
              {parsedNotes.fare && (
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Base Fare</span>
                  <span className="font-bold text-gray-800">{parsedNotes.fare}</span>
                </div>
              )}
              {parsedNotes.tip && (
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Chauffeur Tip</span>
                  <span className="font-bold text-emerald-700">{parsedNotes.tip}</span>
                </div>
              )}
              {(parsedNotes.total || c.price || parsedNotes.fare) && (
                <div className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-right">
                  <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-black text-sm text-white">${displayTotal}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIP Cabin Preferences */}
        {parsedNotes.preferences && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#aa2d29]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                VIP Cabin Preferences
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {parsedNotes.preferences.quietRide && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Quiet Ride</span>
                  <span className="font-bold text-slate-800">{parsedNotes.preferences.quietRide}</span>
                </div>
              )}
              {parsedNotes.preferences.climate && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Cabin Climate</span>
                  <span className="font-bold text-slate-800">{parsedNotes.preferences.climate}</span>
                </div>
              )}
              {parsedNotes.preferences.childSeat && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Child / Baby Seat</span>
                  <span className="font-bold text-slate-800">{parsedNotes.preferences.childSeat}</span>
                </div>
              )}
              {parsedNotes.preferences.meetSign && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-medium block">Meet & Greet Sign</span>
                  <span className="font-bold text-slate-800">{parsedNotes.preferences.meetSign}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Genuine Special Requests / Custom Notes only */}
        {parsedNotes.specialRequests && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                Special Requests & Refreshments
              </p>
            </div>
            <p className="text-sm font-medium text-amber-950 leading-relaxed">
              {parsedNotes.specialRequests}
            </p>
          </div>
        )}
      </td>
    </tr>
  );
}
