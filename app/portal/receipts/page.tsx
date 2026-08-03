'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FileText, Download, CheckCircle2, Search, Eye, X, ShieldCheck, MapPin, Calendar, Building2, ChevronDown } from 'lucide-react';
import logoImg from '../../../public/logo.png';
import { apiFetch } from '@/lib/api';
import { getVehiclePrice } from '@/lib/utils';
import { downloadInvoiceHtml, parseReservationPricing } from '@/lib/invoiceTemplate';

export default function PortalReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const loadFromAPI = async () => {
      try {
        const res = await apiFetch('/me/customer');
        if (res.ok) {
          const result = await res.json();
          if (result.status === 'success' && result.data) {
            const customer = result.data;
            const reservations = (customer.reservations || []).filter((r: any) => r.status !== 'Cancelled');
            const rides = reservations.map((r: any) => ({
              id: `${customer.id}-${r.id}`,
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
            setReceipts(rides);
            return;
          }
        }
      } catch { /* fall through */ }

      // Fallback: localStorage (email-strict)
      const email = (localStorage.getItem('currentCustomerEmail') || '').toLowerCase().trim();
      const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
      const userRides = email
        ? customersDB.filter((c: any) => (c.email || '').toLowerCase().trim() === email)
        : [];
      const rides = userRides.filter((r: any) => r.status !== 'Cancelled');
      rides.sort((a: any, b: any) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime());
      setReceipts(rides);
    };

    loadFromAPI();
  }, []);

  useEffect(() => {
    if (selectedReceipt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedReceipt]);

  const handleDownloadSingle = (receipt: any) => {
    const { basePrice, tipAmount, totalPrice, cardLast4 } = parseReservationPricing(receipt);
    downloadInvoiceHtml({
      id: receipt.id,
      pickupLocation: receipt.pickupLocation,
      dropoffLocation: receipt.dropoffLocation,
      transferDate: receipt.transferDate,
      transferTime: receipt.transferTime,
      transferType: receipt.transferType || 'VIP Transfer',
      vehicleType: receipt.vehicleType,
      passengers: receipt.passengers,
      flightNumber: receipt.flightNumber,
      passengerName: `${receipt.firstName || ''} ${receipt.lastName || ''}`.trim() || 'Valued Customer',
      email: receipt.email,
      phone: receipt.phone,
      company: receipt.company,
      status: receipt.status || 'Confirmed',
      basePrice,
      tipAmount,
      totalPrice,
      cardLast4,
    }, `Invoice_INV_TR_${receipt.id}.html`);
  };

  const filtered = receipts.filter(r => 
    r.pickupLocation?.toLowerCase().includes(search.toLowerCase()) ||
    r.dropoffLocation?.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicleType?.toLowerCase().includes(search.toLowerCase()) ||
    r.transferDate?.includes(search)
  );

  const selectedPricing = selectedReceipt ? parseReservationPricing(selectedReceipt) : { basePrice: 0, tipAmount: 0, totalPrice: 0, cardLast4: '5632' };

  return (
    <div className="pb-12 pt-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-heading tracking-tight">Receipts & Invoices</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Download official tax invoices and receipts for completed transfers</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by route, vehicle, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all"
          />
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No receipts found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Invoice #</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Route</th>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
                {filtered.slice(0, visibleCount).map((receipt) => {
                  const pricing = parseReservationPricing(receipt);
                  return (
                    <tr key={receipt.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">
                        #INV-{receipt.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{receipt.transferDate}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate">
                        <span className="font-semibold text-gray-900">{receipt.pickupLocation}</span>
                        <span className="text-gray-400 mx-1.5">➔</span>
                        <span className="font-semibold text-gray-900">{receipt.dropoffLocation}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
                          {receipt.vehicleType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-gray-900">
                        ${pricing.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReceipt(receipt)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => handleDownloadSingle(receipt)}
                            className="p-1.5 text-gray-400 hover:text-[#aa2d29] hover:bg-[#aa2d29]/10 rounded-lg transition-colors"
                            title="Download Receipt HTML"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > visibleCount && (
        <div className="p-4 flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 group"
          >
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            Show More (+{filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* VIEW RECEIPT MODAL */}
      {selectedReceipt && (
        <div 
          onClick={() => setSelectedReceipt(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200 text-slate-800"
          >
            {/* Modal Top Bar */}
            <div className="flex justify-between items-center p-4 px-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Electronic Receipt Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSingle(selectedReceipt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#aa2d29] hover:bg-[#8a2421] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download HTML
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Receipt Content */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
              
              {/* Header inside Receipt */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4 gap-4">
                <div>
                  <Image 
                    src={logoImg} 
                    alt="Logo" 
                    className="h-8 w-auto mb-2 mix-blend-multiply"
                    priority
                  />
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">VIP Chauffeur & Logistics Services Ltd.</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">Tax Registration No: 9812-4091-VIP</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200 uppercase tracking-widest inline-block mb-1">
                    PAID IN FULL
                  </span>
                  <h2 className="text-lg font-black font-heading text-slate-900 leading-tight">INVOICE #INV-{selectedReceipt.id}</h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Date: {selectedReceipt.transferDate} {selectedReceipt.transferTime || ''}</p>
                </div>
              </div>

              {/* Bill To & Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Billed To</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedReceipt.firstName} {selectedReceipt.lastName}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{selectedReceipt.email || 'No email provided'}</p>
                  <p className="text-slate-500 text-[11px]">{selectedReceipt.phone || 'No phone provided'}</p>
                  {selectedReceipt.company && (
                    <p className="text-[11px] font-semibold text-[#aa2d29] mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Partner: {selectedReceipt.company}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Service Details</span>
                  <p className="text-[11px] font-semibold text-slate-700 mb-0.5"><span className="text-slate-400 font-normal">Service:</span> {selectedReceipt.transferType || 'VIP Transfer'}</p>
                  <p className="text-[11px] font-semibold text-slate-700 mb-0.5"><span className="text-slate-400 font-normal">Vehicle:</span> {selectedReceipt.vehicleType}</p>
                  <p className="text-[11px] font-semibold text-slate-700 mb-0.5"><span className="text-slate-400 font-normal">Passengers:</span> {selectedReceipt.passengers || '1'} Pax</p>
                  {selectedReceipt.flightNumber && (
                    <p className="text-[11px] font-semibold text-slate-700"><span className="text-slate-400 font-normal">Flight No:</span> {selectedReceipt.flightNumber}</p>
                  )}
                </div>
              </div>

              {/* Route Summary Box */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Route Breakdown</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-2.5 px-3">Transfer Route</th>
                        <th className="p-2.5 px-3 text-center">Type</th>
                        <th className="p-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      <tr>
                        <td className="p-2.5 px-3 font-semibold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#aa2d29] shrink-0" />
                            <span>{selectedReceipt.pickupLocation} ➔ {selectedReceipt.dropoffLocation}</span>
                          </div>
                        </td>
                        <td className="p-2.5 px-3 text-center font-medium text-slate-600">{selectedReceipt.vehicleType}</td>
                        <td className={`p-2.5 px-3 text-right font-bold uppercase ${
                          (selectedReceipt.status || '').toLowerCase() === 'pending'
                            ? 'text-amber-600'
                            : (selectedReceipt.status || '').toLowerCase() === 'cancelled'
                            ? 'text-red-600'
                            : 'text-emerald-600'
                        }`}>
                          {(selectedReceipt.status || 'PAID').toUpperCase()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Base Transfer Fare ({selectedReceipt.vehicleType}):</span>
                  <span className="font-bold text-slate-900">${selectedPricing.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Chauffeur Gratuity (Driver Tip):</span>
                  <span className="font-bold text-slate-900">${selectedPricing.tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 font-bold text-slate-900">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Total Paid (Card ending in •••• {selectedPricing.cardLast4}):
                  </span>
                  <span className="text-[#aa2d29] font-black text-sm">
                    ${selectedPricing.totalPrice.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Total & Footer Stamp */}
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 gap-3">
                <div className="flex items-center gap-2.5 bg-[#ecfdf5] p-2.5 px-3.5 rounded-xl border border-[#a7f3d0] flex-1">
                  <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
                  <div>
                    <p className="font-bold text-[#047857] text-xs leading-tight">Verified Electronic Tax Invoice</p>
                    <p className="text-[10px] text-[#059669] leading-tight mt-0.5">Issued electronically under VIP Corporate Account Agreement.</p>
                  </div>
                </div>

                <div className="text-right bg-[#0f172a] text-white p-3.5 px-5 rounded-2xl shadow-sm shrink-0 min-w-[150px]">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] block">TOTAL PAID</span>
                  <span className="text-lg font-black font-heading text-white block leading-tight mt-0.5">
                    ${selectedPricing.totalPrice.toFixed(2)} USD
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-slate-50 p-2.5 px-6 border-t border-slate-100 flex justify-center items-center text-[11px] text-slate-400 shrink-0">
              <span>VIP Chauffeur Services © 2026</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
