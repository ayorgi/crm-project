'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Ticket,
  FileText,
  Download,
  X,
  Building2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import logoImg from '@/public/logo.png';
import { downloadInvoiceHtml } from '@/lib/invoiceTemplate';

interface BookingSuccessModalProps {
  bookingConfirmed: any;
  showReceiptModal: boolean;
  setShowReceiptModal: (val: boolean) => void;
  onResetWizard: () => void;
}

export function BookingSuccessModal({
  bookingConfirmed,
  showReceiptModal,
  setShowReceiptModal,
  onResetWizard,
}: BookingSuccessModalProps) {
  const router = useRouter();

  if (!bookingConfirmed) return null;

  const handleDownloadReceipt = (receipt: any) => {
    downloadInvoiceHtml(
      {
        id: receipt.id,
        pickupLocation: receipt.pickupLocation,
        dropoffLocation: receipt.dropoffLocation,
        transferDate: receipt.transferDate,
        transferTime: receipt.transferTime,
        transferType: receipt.transferType || 'VIP Transfer',
        vehicleType: receipt.vehicleType,
        passengers: receipt.passengers,
        flightNumber: receipt.flightNumber,
        passengerName: receipt.passengerName,
        email: receipt.email,
        phone: receipt.phone,
        company: receipt.company,
        status: receipt.status || 'Confirmed',
        basePrice: parseFloat(receipt.basePrice) || 0,
        tipAmount: parseFloat(receipt.tipAmount) || 0,
        totalPrice: parseFloat(receipt.totalPrice) || 0,
        cardLast4: receipt.cardLast4 || '5632',
      },
      `Invoice_INV_TR_${receipt.id}.html`
    );
  };

  return (
    <div className="w-full max-w-5xl py-10">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-md text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Reservation Received
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mt-3 tracking-tight">
            Booking Received!
          </h1>
          <p className="text-slate-500 mt-1 text-base">
            Your VIP transfer request is currently pending confirmation. Pass Ref:{' '}
            <strong className="text-slate-900">#TR-{bookingConfirmed.id}</strong>
          </p>
        </div>

        {/* Ticket Pass Summary */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#aa2d29]" /> Reservation Details
            </span>
            <span className="text-xs font-bold text-[#aa2d29] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
              {bookingConfirmed.vehicleType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-semibold mb-0.5">Route</p>
              <p className="font-bold text-slate-900 text-sm">
                {bookingConfirmed.pickupLocation} ➔ {bookingConfirmed.dropoffLocation}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold mb-0.5">Date & Time</p>
              <p className="font-bold text-slate-900 text-sm">
                {bookingConfirmed.transferDate} at {bookingConfirmed.transferTime}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold mb-0.5">Passenger Name</p>
              <p className="font-bold text-slate-900 text-sm">{bookingConfirmed.passengerName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold mb-0.5">Contact Number</p>
              <p className="font-bold text-slate-900 text-sm">{bookingConfirmed.phone}</p>
            </div>
          </div>

          {/* Price & Payment Breakdown */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span>Base Transfer Fare:</span>
              <span className="font-bold text-slate-900">${bookingConfirmed.basePrice}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span>Chauffeur Gratuity (Tip):</span>
              <span className="font-bold text-slate-900">${bookingConfirmed.tipAmount}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Total Paid (Card ending in •••• {bookingConfirmed.cardLast4}):
              </span>
              <span className="text-[#aa2d29] text-base font-black">${bookingConfirmed.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-md shadow-emerald-600/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Get Receipt</span>
          </button>
          <button
            onClick={() => router.push('/portal/trips')}
            className="bg-[#aa2d29] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#8e2622] shadow-md shadow-[#aa2d29]/20 text-sm transition-all cursor-pointer active:scale-95"
          >
            View My Trips
          </button>
          <button
            onClick={onResetWizard}
            className="bg-white border border-slate-300 text-slate-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-50 text-sm transition-all cursor-pointer active:scale-95"
          >
            Book Another Transfer
          </button>
        </div>

        {/* Professional PDF/Receipt Modal Popup */}
        {showReceiptModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
            onClick={() => setShowReceiptModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Actions Top Bar */}
              <div className="bg-gray-900 text-white p-3.5 px-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <FileText className="w-4 h-4 text-[#aa2d29]" /> Tax Invoice Preview
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadReceipt(bookingConfirmed)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#aa2d29] hover:bg-[#8e2622] text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Official Invoice Paper Document */}
              <div className="p-5 sm:p-7 space-y-4 bg-white text-left overflow-y-auto flex-1">
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-4 gap-4">
                  <div>
                    <Image src={logoImg} alt="Logo" className="h-8 w-auto mb-2 mix-blend-multiply" priority />
                    <p className="text-[11px] text-gray-400 font-medium leading-tight">
                      VIP Chauffeur & Logistics Services Ltd.
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium leading-tight">
                      Tax Registration No: 9812-4091-VIP
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200 uppercase tracking-widest inline-block mb-1">
                      PAID IN FULL
                    </span>
                    <h2 className="text-lg font-black font-heading text-gray-900 leading-tight">
                      INVOICE #INV-TR-{bookingConfirmed.id}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Date: {bookingConfirmed.transferDate} {bookingConfirmed.transferTime || ''}
                    </p>
                  </div>
                </div>

                {/* Bill To & Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Billed To
                    </span>
                    <p className="font-bold text-gray-900 text-sm">{bookingConfirmed.passengerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {bookingConfirmed.email ||
                        (typeof window !== 'undefined' ? localStorage.getItem('currentCustomerEmail') : '') ||
                        'vip.guest@transfervip.com'}
                    </p>
                    <p className="text-xs text-gray-500">{bookingConfirmed.phone || 'No phone provided'}</p>
                    {bookingConfirmed.company && (
                      <p className="text-xs font-semibold text-[#aa2d29] mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" /> Partner: {bookingConfirmed.company}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Service Details
                    </span>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">
                      <span className="text-gray-400 font-normal">Service:</span>{' '}
                      {bookingConfirmed.transferType || 'VIP Transfer'}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">
                      <span className="text-gray-400 font-normal">Vehicle:</span> {bookingConfirmed.vehicleType}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">
                      <span className="text-gray-400 font-normal">Passengers:</span>{' '}
                      {bookingConfirmed.passengers || '1'} Pax
                    </p>
                    {bookingConfirmed.flightNumber && (
                      <p className="text-xs font-semibold text-gray-700">
                        <span className="text-gray-400 font-normal">Flight No:</span> {bookingConfirmed.flightNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Route Summary Box */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                    Route Breakdown
                  </span>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-[10px] tracking-wider">
                        <tr>
                          <th className="p-2.5 px-3">Transfer Route</th>
                          <th className="p-2.5 px-3 text-center">Type</th>
                          <th className="p-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="p-2.5 px-3 font-semibold text-gray-900">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#aa2d29] shrink-0" />
                              <span>
                                {bookingConfirmed.pickupLocation} ➔ {bookingConfirmed.dropoffLocation}
                              </span>
                            </div>
                          </td>
                          <td className="p-2.5 px-3 text-center font-medium text-gray-600">
                            {bookingConfirmed.vehicleType}
                          </td>
                          <td className="p-2.5 px-3 text-right font-bold uppercase text-emerald-600">PAID</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-200 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Base Transfer Fare ({bookingConfirmed.vehicleType}):</span>
                    <span className="font-bold text-gray-900">${bookingConfirmed.basePrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Chauffeur Gratuity (Driver Tip):</span>
                    <span className="font-bold text-gray-900">${bookingConfirmed.tipAmount}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1.5 flex justify-between items-center text-xs font-bold text-gray-900">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Total Paid (Card ending in ••••{' '}
                      {bookingConfirmed.cardLast4 || '5432'}):
                    </span>
                    <span className="text-[#aa2d29] text-sm font-black">${bookingConfirmed.totalPrice} USD</span>
                  </div>
                </div>

                {/* Total & Footer Stamp */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2.5 border-t border-gray-200 gap-3">
                  <div className="flex items-center gap-2.5 bg-[#ecfdf5] p-2.5 px-3.5 rounded-xl border border-[#a7f3d0] w-full sm:w-auto">
                    <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
                    <div>
                      <p className="font-bold text-[#047857] text-xs leading-tight">Verified Electronic Tax Invoice</p>
                      <p className="text-[10px] text-[#059669] leading-tight mt-0.5">
                        Issued electronically under VIP Corporate Account Agreement.
                      </p>
                    </div>
                  </div>

                  <div className="text-right bg-[#0f172a] text-white p-3.5 px-5 rounded-2xl shadow-sm w-full sm:w-auto shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] block">
                      TOTAL PAID
                    </span>
                    <span className="text-xl font-black font-heading text-white block leading-tight sm:mt-0.5">
                      ${bookingConfirmed.totalPrice} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Footer */}
              <div className="bg-gray-50 p-2.5 px-6 border-t border-gray-100 flex justify-center items-center text-[11px] text-gray-400 shrink-0">
                <span>VIP Chauffeur Services © 2026</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
