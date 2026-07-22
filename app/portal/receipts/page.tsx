'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Download, CheckCircle2, ArrowLeft, Search, Eye, X, Printer, ShieldCheck, MapPin, Car, Calendar, User, Building2, ChevronDown } from 'lucide-react';
import logoImg from '../../../public/logo.png';

const vehiclePrices: Record<string, number> = {
  'VIP Business Van': 150,
  'Executive Sedan': 120,
  'Premium SUV': 180,
  'Luxury Minibus': 220,
  'First Class Sedan': 160,
};

const getVehiclePrice = (vehicleType?: string): number => {
  if (!vehicleType) return 150;
  if (vehiclePrices[vehicleType]) return vehiclePrices[vehicleType];
  for (const [key, price] of Object.entries(vehiclePrices)) {
    if (vehicleType.toLowerCase().includes(key.toLowerCase())) return price;
  }
  return 150;
};

export default function PortalReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
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

    // Filter only valid transfers with receipts
    const validReceipts = userRides.filter((r: any) => r.status !== 'Cancelled');
    setReceipts(validReceipts);
  }, []);

  const handleDownloadSingle = (receipt: any) => {
    const price = getVehiclePrice(receipt.vehicleType);
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #INV-${receipt.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    body { background-color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { background: #ffffff; width: 100%; max-width: 720px; border-radius: 24px; padding: 48px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }
    .top-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .brand-logo { font-size: 20px; font-weight: 900; color: #111827; margin: 0; display: flex; items-center; gap: 8px; }
    .brand-logo span { color: #aa2d29; }
    .sub-company { font-size: 12px; font-weight: 700; color: #94a3b8; margin: 6px 0 2px 0; }
    .tax-no { font-size: 12px; color: #94a3b8; margin: 0; font-weight: 500; }
    .inv-right { text-align: right; }
    .badge { display: inline-block; padding: 5px 14px; background: #ecfdf5; color: #047857; font-weight: 800; font-size: 11px; border-radius: 9999px; border: 1px solid #a7f3d0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .inv-num { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.5px; }
    .date-str { font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500; }
    .divider { height: 1px; background: #f1f5f9; margin: 28px 0; }
    .info-box { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; background: #f8fafc; padding: 24px 28px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 28px; }
    .sec-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px; }
    .client-name { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
    .client-detail { font-size: 13px; color: #64748b; margin: 3px 0; font-weight: 500; }
    .table-container { border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #f8fafc; padding: 14px 20px; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 18px 20px; border-top: 1px solid #f1f5f9; font-weight: 700; color: #0f172a; }
    .status-confirmed { color: #059669; font-weight: 800; text-align: right; }
    .bottom-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 28px; }
    .stamp-box { background: #ecfdf5; padding: 16px 20px; border-radius: 16px; border: 1px solid #a7f3d0; font-size: 13px; color: #065f46; font-weight: 800; display: flex; items-center; gap: 12px; max-width: 360px; }
    .stamp-sub { font-size: 11px; color: #059669; font-weight: 500; margin-top: 3px; }
    .total-box { background: #0f172a; color: #ffffff; padding: 20px 32px; border-radius: 20px; text-align: right; min-width: 220px; }
    .total-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; }
    .total-price { font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin-top: 2px; display: block; }
    .page-footer { margin-top: 32px; font-size: 12px; font-weight: 600; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="top-header">
      <div>
        <img src="${window.location.origin}/logo.png" alt="Logo" style="height: 38px; width: auto; display: block; margin-bottom: 8px;" />
        <div class="sub-company">VIP Chauffeur & Logistics Services Ltd.</div>
        <div class="tax-no">Tax Registration No: 9812-4091-VIP</div>
      </div>
      <div class="inv-right">
        <span class="badge">PAID IN FULL</span>
        <h2 class="inv-num">INVOICE #INV-${receipt.id}</h2>
        <p class="date-str">Date: ${receipt.transferDate} ${receipt.transferTime || ''}</p>
      </div>
    </div>

    <div class="divider"></div>

    <div class="info-box">
      <div>
        <span class="sec-label">BILLED TO</span>
        <p class="client-name">${receipt.firstName || ''} ${receipt.lastName || ''}</p>
        <p class="client-detail">${receipt.email || ''}</p>
        <p class="client-detail">${receipt.phone || ''}</p>
        ${receipt.company ? `<p class="client-detail" style="color:#aa2d29; font-weight:700; margin-top:6px;">Partner: ${receipt.company}</p>` : ''}
      </div>
      <div>
        <span class="sec-label">SERVICE DETAILS</span>
        <p class="client-detail"><span style="color:#94a3b8;">Service:</span> <b>${receipt.transferType || 'Airport Transfer'}</b></p>
        <p class="client-detail"><span style="color:#94a3b8;">Vehicle:</span> <b>${receipt.vehicleType || 'Executive Vehicle'}</b></p>
        <p class="client-detail"><span style="color:#94a3b8;">Passengers:</span> <b>${receipt.passengers || '1'} Pax</b></p>
        ${receipt.flightNumber ? `<p class="client-detail"><span style="color:#94a3b8;">Flight No:</span> <b>${receipt.flightNumber}</b></p>` : ''}
      </div>
    </div>

    <span class="sec-label" style="margin-left:4px;">ROUTE BREAKDOWN</span>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>TRANSFER ROUTE</th>
            <th style="text-align:center;">TYPE</th>
            <th style="text-align:right;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aa2d29" stroke-width="2" style="vertical-align:-2px; margin-right:6px; display:inline-block;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${receipt.pickupLocation} ➔ ${receipt.dropoffLocation}</td>
            <td style="text-align:center; color:#64748b; font-weight:500;">${receipt.vehicleType}</td>
            <td class="status-confirmed">CONFIRMED</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="divider"></div>

    <div class="bottom-row">
      <div class="stamp-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        <div>
          <div style="font-weight:700; color:#047857; font-size:14px;">Verified Electronic Tax Invoice</div>
          <div class="stamp-sub">Issued electronically under VIP Corporate Account Agreement.</div>
        </div>
      </div>
      <div class="total-box">
        <span class="total-label">TOTAL AMOUNT PAID</span>
        <span class="total-price">$${price}.00</span>
        <span style="font-size:24px; font-weight:900; color:#ffffff; display:block; margin-top:2px;">USD</span>
      </div>
    </div>
  </div>

  <div class="page-footer">VIP Chauffeur Services © 2026</div>
</body>
</html>`;

    const blob = new Blob([htmlContent.trim()], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_INV_${receipt.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered = receipts.filter(r => 
    r.pickupLocation?.toLowerCase().includes(search.toLowerCase()) ||
    r.dropoffLocation?.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicleType?.toLowerCase().includes(search.toLowerCase()) ||
    r.transferDate?.includes(search)
  );

  return (
    <div className="animate-in fade-in duration-300 pb-10">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl text-gray-900 font-heading font-bold tracking-tight flex items-center gap-3">
              Receipts & Invoices
            </h1>
            <p className="text-gray-500 mt-2 text-lg">View and download official tax invoices for your VIP transfers.</p>
          </div>
          {receipts.length > 0 && (
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search receipts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#aa2d29] transition-all w-64 shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Receipts Found</h3>
          <p className="text-gray-500 max-w-sm mb-6 text-lg">Official invoices will appear here once your transfers are confirmed or completed.</p>
          <Link href="/portal/book" className="bg-[#aa2d29] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#8e2622] transition-colors shadow-md">
            Book a Transfer
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-transparent">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Total Receipts ({filtered.length})
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Verified
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.slice(0, visibleCount).map((r) => (
              <div key={r.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#aa2d29] flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900 text-lg">Invoice #INV-{r.id}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Paid
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {r.pickupLocation} ➔ {r.dropoffLocation}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <span>Date: {r.transferDate}</span>
                      <span>• Vehicle: {r.vehicleType}</span>
                      <span className="font-bold text-gray-900">• Price: ${getVehiclePrice(r.vehicleType)}.00 USD</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 justify-end">
                  <button
                    onClick={() => setSelectedReceipt(r)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#aa2d29] text-white rounded-xl text-sm font-bold hover:bg-[#8e2622] transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4" /> View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length > visibleCount && (
            <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 group"
              >
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                Show More (+{filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Professional PDF/Receipt Modal Popup */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-100 my-8 relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Actions Top Bar */}
            <div className="bg-gray-900 text-white p-4 px-8 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <FileText className="w-4 h-4 text-[#aa2d29]" /> Tax Invoice Preview
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadSingle(selectedReceipt)}
                  className="flex items-center gap-2 px-5 py-2 bg-[#aa2d29] hover:bg-[#8e2622] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Invoice Paper Document */}
            <div className="p-8 md:p-12 space-y-8 bg-white">
              
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-200 pb-8 gap-6">
                <div>
                  <Image
                    src={logoImg}
                    alt="Logo"
                    className="h-10 w-auto mb-3 mix-blend-multiply"
                    priority
                  />
                  <p className="text-xs text-gray-400 font-medium">VIP Chauffeur & Logistics Services Ltd.</p>
                  <p className="text-xs text-gray-400 font-medium">Tax Registration No: 9812-4091-VIP</p>
                </div>
                <div className="text-left md:text-right">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 uppercase tracking-widest inline-block mb-2">
                    PAID IN FULL
                  </span>
                  <h2 className="text-2xl font-black font-heading text-gray-900">INVOICE #INV-{selectedReceipt.id}</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">Date: {selectedReceipt.transferDate} {selectedReceipt.transferTime || ''}</p>
                </div>
              </div>

              {/* Bill To & Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Billed To</span>
                  <p className="font-bold text-gray-900 text-base">{selectedReceipt.firstName} {selectedReceipt.lastName}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedReceipt.email || 'No email provided'}</p>
                  <p className="text-xs text-gray-500">{selectedReceipt.phone || 'No phone provided'}</p>
                  {selectedReceipt.company && (
                    <p className="text-xs font-semibold text-[#aa2d29] mt-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Partner: {selectedReceipt.company}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Service Details</span>
                  <p className="text-xs font-semibold text-gray-700 mb-1"><span className="text-gray-400 font-normal">Service:</span> {selectedReceipt.transferType || 'VIP Transfer'}</p>
                  <p className="text-xs font-semibold text-gray-700 mb-1"><span className="text-gray-400 font-normal">Vehicle:</span> {selectedReceipt.vehicleType}</p>
                  <p className="text-xs font-semibold text-gray-700 mb-1"><span className="text-gray-400 font-normal">Passengers:</span> {selectedReceipt.passengers || '1'} Pax</p>
                  {selectedReceipt.flightNumber && (
                    <p className="text-xs font-semibold text-gray-700"><span className="text-gray-400 font-normal">Flight No:</span> {selectedReceipt.flightNumber}</p>
                  )}
                </div>
              </div>

              {/* Route Summary Box */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Route Breakdown</span>
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Transfer Route</th>
                        <th className="p-4 text-center">Type</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#aa2d29]" />
                            {selectedReceipt.pickupLocation} ➔ {selectedReceipt.dropoffLocation}
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium text-gray-600">{selectedReceipt.vehicleType}</td>
                        <td className="p-4 text-right font-bold text-emerald-600">CONFIRMED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total & Footer Stamp */}
              <div className="flex flex-col md:flex-row justify-between items-end pt-4 border-t border-gray-200 gap-6">
                <div className="flex items-start gap-3 bg-[#ecfdf5] p-4 px-5 rounded-2xl border border-[#a7f3d0] max-w-md">
                  <ShieldCheck className="w-5 h-5 text-[#047857] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#047857] text-sm">Verified Electronic Tax Invoice</p>
                    <p className="text-[11px] text-[#059669] mt-0.5 leading-snug">Issued electronically under VIP Corporate Account Agreement.</p>
                  </div>
                </div>

                <div className="text-right bg-[#0f172a] text-white p-6 px-8 rounded-3xl shadow-sm min-w-[220px]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] block mb-1">TOTAL AMOUNT PAID</span>
                  <span className="text-4xl font-black font-heading text-white block leading-none">${getVehiclePrice(selectedReceipt.vehicleType)}.00</span>
                  <span className="text-2xl font-black font-heading text-white block mt-1 tracking-tight">USD</span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-gray-50 p-4 px-8 border-t border-gray-100 flex justify-center items-center text-xs text-gray-400">
              <span>VIP Chauffeur Services © 2026</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
